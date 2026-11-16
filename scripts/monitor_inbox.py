# -*- coding: utf-8 -*-
"""
Monitor Automático de Bandeja de Entrada - OFMC 2026
---------------------------------------------------
Verifica cada 3 horas la bandeja de entrada (ofmc2026@gmail.com),
clasifica nuevas consultas, observaciones y resúmenes de autores,
y despacha un reporte detallado a manuel.castillo@uv.cl.
Diseñado para ejecutarse tanto localmente como en GitHub Actions.
"""

import os
import sys
import json
import imaplib
import smtplib
import argparse
from datetime import datetime, timezone, timedelta
import email
from email.header import decode_header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- CONFIGURACIÓN Y CREDENCIALES ---
GMAIL_USER = os.environ.get("GMAIL_USER", "ofmc2026@gmail.com")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "iswfhwmmbhgeyljn")
REPORT_RECIPIENT = os.environ.get("REPORT_RECIPIENT", "manuel.castillo@uv.cl")
CC_RECIPIENT = os.environ.get("CC_RECIPIENT", "ofmc2026@gmail.com")

IMAP_SERVER = "imap.gmail.com"
IMAP_PORT = 993
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATE_FILE = os.path.join(BASE_DIR, "monitor_state.json")

# Zona horaria de Chile (UTC-3)
CHILE_TZ = timezone(timedelta(hours=-3))


def decode_mime(s):
    """Decodifica encabezados MIME a texto plano legible."""
    if not s:
        return ""
    res = []
    for fragment, encoding in decode_header(s):
        if isinstance(fragment, bytes):
            res.append(fragment.decode(encoding or "utf-8", errors="ignore"))
        else:
            res.append(fragment)
    return "".join(res)


def get_email_body_and_attachments(msg):
    """Extrae texto del cuerpo y lista de nombres de archivos adjuntos."""
    body_text = ""
    attachments = []

    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get("Content-Disposition", ""))

            if "attachment" in cdispo:
                filename = part.get_filename()
                if filename:
                    attachments.append(decode_mime(filename))
            elif ctype == "text/plain" and not body_text:
                payload = part.get_payload(decode=True)
                if payload:
                    body_text = payload.decode(part.get_content_charset() or "utf-8", errors="ignore")
            elif ctype == "text/html" and not body_text:
                payload = part.get_payload(decode=True)
                if payload:
                    body_text = payload.decode(part.get_content_charset() or "utf-8", errors="ignore")
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            body_text = payload.decode(msg.get_content_charset() or "utf-8", errors="ignore")

    # Limpieza de texto básico
    clean_text = " ".join(body_text.split())
    return clean_text, attachments


def classify_email(sender, subject, body):
    """
    Clasifica el correo según el contenido en categorías semánticas:
    - BOUNCE: Rebote o falla de entrega del servidor
    - CAMBIO_PROGRAMA: Solicitud de cambio de horario, sala, bloque, día o asistencia
    - RESUMEN_CORREGIDO: Envío de resumen corregido / observaciones de evaluación
    - CONSULTA: Duda o consulta general de autores
    - SOCIAL_SPAM: Mensajes automáticos de redes sociales
    - OTRO: Comunicaciones varias
    """
    s_low = subject.lower()
    b_low = body.lower()
    snd_low = sender.lower()

    if any(k in snd_low for k in ["mailer-daemon", "postmaster"]) or any(k in s_low for k in ["undeliverable", "delivery status notification", "failure", "blocked"]):
        return "BOUNCE", "🚨 Rebote / Falla de Entrega", "#EF4444"

    if any(k in snd_low for k in ["facebookmail.com", "instagram.com", "linkedin"]):
        return "SOCIAL_SPAM", "📢 Redes Sociales / Notificación Externa", "#94A3B8"

    # Solicitudes de agenda o programa
    keywords_cambio = [
        "cambio de día", "cambio de dia", "cambio de fecha", "cambio de horario",
        "problema en programa", "error en programa", "no podré", "no podre",
        "asistencia", "imposibilitado", "no podré asistir", "mover mi ponencia",
        "cambiar mi ponencia", "traslado", "bloque", "afiliación", "afiliacion"
    ]
    if any(k in s_low or k in b_low for k in keywords_cambio):
        return "CAMBIO_PROGRAMA", "🔄 Solicitud de Cambio / Agenda Programa", "#F59E0B"

    # Resúmenes corregidos
    keywords_resumen = ["resumen corregido", "abstract corregido", "observaciones de evaluación", "observaciones de evaluacion", "evaluación de resumen"]
    if any(k in s_low or k in b_low for k in keywords_resumen):
        return "RESUMEN_CORREGIDO", "📝 Resumen Corregido", "#3B82F6"

    # Consultas generales
    keywords_consulta = ["?", "consulta", "duda", "pregunta", "información", "informacion", "certificado", "inscripción", "pago", "hotel", "hospedaje"]
    if any(k in s_low or k in b_low for k in keywords_consulta):
        return "CONSULTA", "❓ Consulta de Autor / Asistente", "#8B5CF6"

    return "OTRO", "💬 Mensaje General / Otro", "#64748B"


def load_state():
    """Carga el estado previo de monitoreo."""
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Aviso: Error al leer {STATE_FILE}: {e}")
    return {
        "last_checked_timestamp": None,
        "last_processed_mid": 0,
        "processed_mids": [],
        "total_reports_sent": 0
    }


def save_state(state):
    """Guarda el estado actual de monitoreo."""
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def build_html_report(items, total_inbox_count, is_heartbeat=False):
    """Construye el cuerpo HTML del reporte por correo."""
    now_chile = datetime.now(CHILE_TZ).strftime("%d/%m/%Y %H:%M hrs (CLST / UTC-3)")

    if is_heartbeat:
        content_html = f"""
        <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0;">✅ Bandeja al Día: Sin Nuevas Consultas</h3>
            <p style="color: #15803D; margin: 0; font-size: 14px;">
                En este ciclo de monitoreo no se detectaron nuevas consultas ni observaciones de autores pendientes de revisión.
            </p>
            <p style="color: #475569; font-size: 13px; margin: 10px 0 0 0;">
                <strong>Total de mensajes en bandeja:</strong> {total_inbox_count} | <strong>Próximo chequeo:</strong> en 3 horas.
            </p>
        </div>
        """
    else:
        # Contadores por categoría
        counts = {}
        for item in items:
            cat = item["category_label"]
            counts[cat] = counts.get(cat, 0) + 1

        summary_pills = "".join([
            f'<span style="display: inline-block; background-color: #E2E8F0; color: #1E293B; padding: 4px 10px; border-radius: 12px; font-size: 12px; margin-right: 8px; margin-bottom: 6px;"><b>{cat}:</b> {cnt}</span>'
            for cat, cnt in counts.items()
        ])

        cards_html = ""
        for i, item in enumerate(items, 1):
            att_info = ""
            if item["attachments"]:
                att_info = f'<p style="margin: 4px 0; font-size: 12.5px; color: #0284C7;">📎 <b>Archivos adjuntos:</b> {", ".join(item["attachments"])}</p>'

            snippet = item["snippet"]
            if len(snippet) > 300:
                snippet = snippet[:300] + "..."

            cards_html += f"""
            <div style="border: 1px solid #E2E8F0; border-left: 5px solid {item['badge_color']}; border-radius: 6px; padding: 14px 18px; margin-bottom: 16px; background-color: #FFFFFF;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="background-color: {item['badge_color']}; color: #FFFFFF; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">{item['category_label']}</span>
                    <span style="font-size: 12px; color: #64748B;">{item['date']}</span>
                </div>
                <div style="font-size: 14px; font-weight: bold; color: #1B365D; margin: 4px 0;">{item['subject']}</div>
                <div style="font-size: 13px; color: #334155; margin-bottom: 8px;"><b>De:</b> {item['sender']}</div>
                {att_info}
                <div style="background-color: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 4px; padding: 10px; font-size: 13px; color: #334155; line-height: 1.5; font-style: italic;">
                    "{snippet}"
                </div>
            </div>
            """

        content_html = f"""
        <div style="margin: 15px 0;">
            <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 8px 0; color: #1E40AF; font-size: 15px;">📊 Resumen del Período ({len(items)} comunicaciones detectadas)</h3>
                <div style="margin-top: 8px;">{summary_pills}</div>
            </div>
            <h4 style="color: #1B365D; margin: 15px 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Detalle de Comunicaciones Recibidas:</h4>
            {cards_html}
        </div>
        """

    full_html = f"""\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #1E293B;">
<div style="max-width: 700px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #1B365D 0%, #0077B6 100%); color: #FFFFFF; padding: 22px 25px; text-align: center;">
        <h2 style="margin: 0 0 4px 0; font-size: 19px; font-weight: 700;">OFMC 2026 — Monitoreo Automático de Bandeja</h2>
        <p style="margin: 0; font-size: 13px; opacity: 0.9;">Reporte Periódico de Consultas y Observaciones de Autores</p>
    </div>
    <div style="padding: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 15px;">
            <span style="font-size: 13px; color: #64748B;"><b>Fecha del Reporte:</b> {now_chile}</span>
            <span style="font-size: 13px; color: #1B365D; background: #F1F5F9; padding: 3px 8px; border-radius: 4px;"><b>Buzón:</b> {GMAIL_USER}</span>
        </div>
        {content_html}
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center;">
            <p style="margin: 3px 0;">Este reporte es generado y despachado de forma autónoma cada 3 horas por el sistema de monitoreo cloud de OFMC 2026.</p>
            <p style="margin: 3px 0;">Plataforma Oficial: <a href="https://manuelcastillos.github.io/manuel_oce_castillo/app_congreso/index.html" style="color: #0077B6; text-decoration: none;">Web App Programa OFMC 2026</a> | <a href="https://manuelcastillos.github.io/manuel_oce_castillo/app_congreso/buscador.html" style="color: #0077B6; text-decoration: none;">Buscador Rápido</a></p>
        </div>
    </div>
</div>
</body>
</html>
"""
    return full_html


def send_report(subject, html_content, dry_run=False):
    """Envía el reporte generado a través de SMTP seguro."""
    if dry_run:
        print(f"[DRY-RUN] Reporte generado. Asunto: {subject}. Destinatario: {REPORT_RECIPIENT}")
        return True

    msg = MIMEMultipart("alternative")
    msg["From"] = f"OFMC 2026 Monitor <{GMAIL_USER}>"
    msg["To"] = REPORT_RECIPIENT
    if CC_RECIPIENT and CC_RECIPIENT != REPORT_RECIPIENT:
        msg["Cc"] = CC_RECIPIENT
    msg["Subject"] = subject
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    destinatarios = [REPORT_RECIPIENT]
    if CC_RECIPIENT and CC_RECIPIENT != REPORT_RECIPIENT:
        destinatarios.append(CC_RECIPIENT)

    print(f"Enviando reporte por correo a {destinatarios}...")
    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.send_message(msg, from_addr=GMAIL_USER, to_addrs=destinatarios)
        print("Reporte despachado exitosamente.")
        return True
    except Exception as e:
        print(f"Error al despachar correo vía SMTP: {e}")
        return False


def run_monitor(force_report=False, dry_run=False, init_baseline=False):
    """Función principal de monitoreo."""
    print("=" * 65)
    print(f"  OFMC 2026 — INBOX MONITOR (Cada 3 Horas)")
    print(f"  Fecha/Hora: {datetime.now(CHILE_TZ).strftime('%Y-%m-%d %H:%M:%S CLST')}")
    print("=" * 65)

    if not GMAIL_APP_PASSWORD:
        print("ERROR: Clave de aplicación de Gmail no configurada.")
        sys.exit(1)

    state = load_state()
    last_processed_mid = state.get("last_processed_mid", 0)
    processed_mids = set(state.get("processed_mids", []))

    print(f"Conectando a IMAP ({IMAP_SERVER}:{IMAP_PORT}) como {GMAIL_USER}...")
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        mail.select("INBOX")
    except Exception as e:
        print(f"ERROR: Falló conexión IMAP: {e}")
        sys.exit(1)

    status, messages = mail.search(None, "ALL")
    if status != "OK" or not messages[0]:
        print("No se encontraron mensajes en la bandeja.")
        mail.logout()
        return

    msg_ids = [int(x) for x in messages[0].split()]
    total_inbox = len(msg_ids)
    highest_mid = max(msg_ids) if msg_ids else 0
    print(f"Total mensajes en bandeja: {total_inbox}. ID más alto: {highest_mid}.")
    print(f"Último ID procesado previamente: {last_processed_mid}.")

    # Determinamos qué mensajes analizar
    if init_baseline or last_processed_mid == 0:
        # En la primera corrida o baseline, analizamos los últimos 30 mensajes para generar el reporte de arranque
        mids_to_check = msg_ids[-30:] if len(msg_ids) >= 30 else msg_ids
        print(f"Modo inicial / baseline: Analizando los últimos {len(mids_to_check)} mensajes de la bandeja.")
    else:
        # Mensajes con ID superior al último procesado
        mids_to_check = [mid for mid in msg_ids if mid > last_processed_mid and mid not in processed_mids]
        print(f"Modo periódico: {len(mids_to_check)} mensajes nuevos detectados desde la última revisión.")

    nuevos_items = []
    for mid in mids_to_check:
        try:
            res, data = mail.fetch(str(mid), "(RFC822)")
            if res != "OK" or not data or not data[0]:
                continue
            msg = email.message_from_bytes(data[0][1])

            sender = decode_mime(msg.get("From", ""))
            subject = decode_mime(msg.get("Subject", ""))
            date_str = msg.get("Date", "")

            # Ignorar correos salientes enviados por ofmc2026 a terceros (salvo si es prueba a sí mismo)
            if "ofmc2026@gmail.com" in sender.lower() and "jennifer" not in subject.lower() and "test" not in subject.lower():
                continue

            body_snippet, attachments = get_email_body_and_attachments(msg)
            cat_code, cat_label, badge_color = classify_email(sender, subject, body_snippet)

            # Ignorar notificaciones de redes sociales
            if cat_code == "SOCIAL_SPAM":
                continue

            item = {
                "id": mid,
                "sender": sender,
                "subject": subject,
                "date": date_str,
                "snippet": body_snippet,
                "attachments": attachments,
                "category_code": cat_code,
                "category_label": cat_label,
                "badge_color": badge_color
            }
            nuevos_items.append(item)
            processed_mids.add(mid)
        except Exception as e:
            print(f"Error procesando mensaje ID {mid}: {e}")

    mail.logout()

    now_str = datetime.now(CHILE_TZ).strftime("%d/%m %H:%M")
    if nuevos_items:
        print(f"Se encontraron {len(nuevos_items)} comunicaciones relevantes.")
        subject = f"[OFMC 2026] Reporte Bandeja ({len(nuevos_items)} nuevas) - {now_str}"
        html_report = build_html_report(nuevos_items, total_inbox, is_heartbeat=False)
        send_report(subject, html_report, dry_run=dry_run)
    else:
        print("Sin nuevas consultas ni observaciones en este ciclo.")
        if force_report:
            subject = f"[OFMC 2026] Estado Bandeja al Día (0 nuevas) - {now_str}"
            html_report = build_html_report([], total_inbox, is_heartbeat=True)
            send_report(subject, html_report, dry_run=dry_run)
        else:
            print("Omitiendo despacho de correo (sin novedades).")

    # Actualizar y guardar estado
    state["last_checked_timestamp"] = datetime.now(timezone.utc).isoformat()
    state["last_processed_mid"] = highest_mid
    state["processed_mids"] = sorted(list(processed_mids))[-200:]  # Mantener últimos 200 IDs
    if nuevos_items or force_report:
        state["total_reports_sent"] = state.get("total_reports_sent", 0) + 1
        state["last_report_sent"] = datetime.now(CHILE_TZ).isoformat()

    if not dry_run:
        save_state(state)
        print(f"Estado actualizado y guardado en: {STATE_FILE}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Monitor de bandeja OFMC 2026")
    parser.add_argument("--force-report", action="store_true", help="Fuerza el envío de un reporte aunque no haya novedades")
    parser.add_argument("--init", action="store_true", help="Ejecución inicial de reconocimiento / baseline")
    parser.add_argument("--dry-run", action="store_true", help="Ejecutar sin enviar correos ni alterar estado")
    args = parser.parse_args()

    run_monitor(force_report=args.force_report, dry_run=args.dry_run, init_baseline=args.init)
