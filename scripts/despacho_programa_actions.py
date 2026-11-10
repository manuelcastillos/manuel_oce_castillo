# -*- coding: utf-8 -*-
"""
Script de Envío Masivo Oficial de Programa OFMC 2026 para GitHub Actions
Lee credenciales desde variables de entorno (GMAIL_APP_PASSWORD)
"""
import os
import sys
import json
import time
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

CORREO_OFICIAL = "ofmc2026@gmail.com"
CLAVE_APLICACION = os.environ.get("GMAIL_APP_PASSWORD")

if not CLAVE_APLICACION:
    print("ERROR: Variable de entorno GMAIL_APP_PASSWORD no configurada en GitHub Secrets.")
    sys.exit(1)

# Rutas relativas dentro del repositorio
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_pendientes = os.path.join(base_dir, "scripts", "destinatarios_pendientes.json")
pdf_path = os.path.join(base_dir, "app_congreso", "Programa_Detallado_OFMC2026.pdf")
log_path = os.path.join(base_dir, "scripts", "historial_envios_cloud.txt")

SHORT_LINK = "https://is.gd/ofmc2026"

print("==================================================================")
print("  ENVÍO OFICIAL CLOUD: PROGRAMA DETALLADO OFMC 2026 + APP MÓVIL   ")
print("==================================================================")

if not os.path.exists(json_pendientes):
    print(f"ERROR: Archivo {json_pendientes} no encontrado.")
    sys.exit(1)

with open(json_pendientes, "r", encoding="utf-8") as f:
    destinatarios = json.load(f)

print(f"Total destinatarios pendientes a despachar: {len(destinatarios)}")

if not os.path.exists(pdf_path):
    print(f"ERROR: Archivo PDF {pdf_path} no encontrado.")
    sys.exit(1)

print(f"Cargando PDF adjunto: {pdf_path} ({os.path.getsize(pdf_path)} bytes)...")
with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

def connect_smtp():
    print("Conectando con smtp.gmail.com:465 (SSL)...")
    srv = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30)
    srv.login(CORREO_OFICIAL, CLAVE_APLICACION)
    print("Autenticación SMTP exitosa en la nube.")
    return srv

server = connect_smtp()

total_enviados = 0
errores = []

try:
    for idx, item in enumerate(destinatarios, 1):
        correo = item["email"]
        nombre = item["name"]

        text_body = f"""Estimado/a {nombre},

Junto con saludarle cordialmente desde el Comité Organizador del VIII Congreso Nacional de Oceanografía Física, Meteorología y Clima (OFMC 2026), nos complace compartir con usted la primera versión del Programa Oficial del Congreso, disponible en el archivo PDF adjunto a este mensaje.

Le informamos que esta es una primera versión del Programa que puede sufrir modificaciones menores de ajuste de horario o sala previo al evento.

¡Los esperamos en Valparaíso el próximo 24 de noviembre para dar inicio a nuestras jornadas académicas y de intercambio científico!

============================================================
📱 INSTALE LA APLICACIÓN OFICIAL DEL CONGRESO EN SU CELULAR
============================================================
Para facilitar su navegación interactiva durante los 4 días del evento, hemos desarrollado la aplicación web móvil oficial (PWA):

👉 Enlace de instalación: {SHORT_LINK}

¿Cómo instalarla en su celular?
• En Android (Google Chrome): Abra el enlace ({SHORT_LINK}), toque el menú de tres puntos (⋮) en la esquina superior derecha y elija "Instalar aplicación" o "Agregar a la pantalla principal".
• En iPhone / iPad (Safari): Abra el enlace ({SHORT_LINK}), presione el botón Compartir (el ícono cuadrado con flecha hacia arriba) y seleccione "Agregar al inicio".

Ventajas de la Aplicación Móvil:
✔ Funciona sin conexión a internet (offline).
✔ Permite marcar sus charlas y pósters favoritos con el corazón para crear "Mi Agenda".
✔ Exporta recordatorios directos a Google Calendar y archivos .ics con alarmas de 10 minutos.
✔ Durante el congreso (24 al 27 de nov.), la pestaña "En Vivo" mostrará en tiempo real qué ponencia está ocurriendo en cada sala.
✔ Información de sedes, salas y sugerencias gastronómicas del barrio Almendral y Plaza O'Higgins.

Agradecemos su valiosa participación y contribución a esta nueva edición del Congreso OFMC 2026.

Nos vemos muy pronto en Valparaíso.

Atentamente,

Comité Organizador OFMC 2026
Dr. Manuel Castillo · Dra. Catalina Aguirre · Dr. Julio Marín Aguado
Universidad de Valparaíso & GT DOCA
Contacto: ofmc2026@gmail.com | Web: www.doca2026.cl
Sede: Facultad de Ciencias Sociales (FACSO), Hontaneda 2653, Valparaíso.
"""

        html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; background-color: #f8fafc; margin: 0; padding: 20px; }}
    .container {{ max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
    .header {{ background: linear-gradient(135deg, #1B365D, #0077b6); padding: 28px 24px; text-align: center; color: #ffffff; }}
    .header h1 {{ margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }}
    .header p {{ margin: 0; font-size: 13px; opacity: 0.9; }}
    .content {{ padding: 28px 24px; }}
    .greeting {{ font-size: 16px; font-weight: 600; margin-bottom: 14px; color: #0f172a; }}
    .notice-box {{ background: #eff6ff; border-left: 4px solid #0284c7; padding: 12px 16px; border-radius: 4px; margin: 18px 0; font-size: 14px; color: #0369a1; }}
    .highlight-card {{ background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; padding: 22px; border-radius: 10px; margin: 24px 0; text-align: center; }}
    .highlight-card h2 {{ margin: 0 0 10px 0; font-size: 17px; color: #38bdf8; }}
    .highlight-card p {{ font-size: 13px; color: #94a3b8; margin-bottom: 16px; }}
    .btn-link {{ display: inline-block; background: #0284c7; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 12px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3); }}
    .install-steps {{ background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 13px; margin-top: 16px; text-align: left; }}
    .install-steps strong {{ color: #0f172a; display: block; margin-bottom: 4px; }}
    .features-list {{ padding-left: 20px; font-size: 13px; color: #334155; }}
    .features-list li {{ margin-bottom: 6px; }}
    .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; font-size: 12px; color: #64748b; text-align: center; }}
    .footer strong {{ color: #1e293b; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VIII Congreso Nacional de Oceanografía Física, Meteorología y Clima</h1>
      <p>OFMC 2026 · Valparaíso, 24 al 27 de Noviembre</p>
    </div>
    <div class="content">
      <div class="greeting">Estimado/a {nombre},</div>
      <p>
        Junto con saludarle cordialmente desde el Comité Organizador del <strong>VIII Congreso Nacional OFMC 2026</strong>, nos complace compartir con usted la <strong>primera versión del Programa Oficial del Congreso</strong>, adjunto a este correo en formato PDF.
      </p>
      <div class="notice-box">
        <strong>Nota de la Organización:</strong> Esta es la primera versión del Programa y puede sufrir modificaciones menores de horario o sala previo al evento.
      </div>
      <p style="font-weight: 600; color: #0369a1; text-align: center; font-size: 15px;">
        ¡Los esperamos en Valparaíso el próximo 24 de noviembre!
      </p>

      <div class="highlight-card">
        <h2>📱 Aplicación Oficial para Celulares</h2>
        <p>Acceda e instale en su teléfono la Web App interactiva para consultar horarios, resúmenes y su agenda personalizada sin conexión a internet:</p>
        <a href="{SHORT_LINK}" class="btn-link" target="_blank">Abrir e Instalar Aplicación</a>
        <div style="margin-top: 10px; font-size: 12px; color: #94a3b8;">
          Enlace de instalación: <a href="{SHORT_LINK}" style="color: #38bdf8; text-decoration: underline;">{SHORT_LINK}</a>
        </div>

        <div class="install-steps">
          <strong>¿Cómo instalarla en su celular?</strong>
          <p style="margin: 4px 0 8px 0; color: #475569;">• <strong>Android (Chrome):</strong> Ingrese al enlace, toque los tres puntos (⋮) arriba a la derecha y elija <em>"Instalar aplicación"</em> o <em>"Agregar a la pantalla principal"</em>.</p>
          <p style="margin: 0; color: #475569;">• <strong>iPhone / iOS (Safari):</strong> Ingrese al enlace, toque el botón Compartir (ícono cuadrado con flecha arriba) y elija <em>"Agregar al inicio"</em>.</p>
        </div>
      </div>

      <p style="font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 6px;">Funcionalidades destacadas de la App:</p>
      <ul class="features-list">
        <li><strong>Modo Offline:</strong> Funciona sin conexión a internet una vez cargada.</li>
        <li><strong>Mi Agenda Personal:</strong> Toque el corazón en cualquier charla o póster para guardarla y activar recordatorios silenciosos con vibración (10 min antes).</li>
        <li><strong>Exportación:</strong> Guarde eventos directamente en Google Calendar o descargue archivos <code>.ics</code>.</li>
        <li><strong>En Vivo durante el Congreso:</strong> Seguimiento automático de las sesiones paralelas en Sala 2.5 y Sala 3.7.</li>
        <li><strong>Información Práctica:</strong> Sedes, planos de salas y recomendaciones gastronómicas en Valparaíso.</li>
      </ul>

      <p style="margin-top: 20px;">Agradecemos su valiosa participación y contribución a esta nueva edición del Congreso OFMC 2026.</p>
    </div>
    <div class="footer">
      <strong>Comité Organizador OFMC 2026</strong><br>
      Dr. Manuel Castillo · Dra. Catalina Aguirre · Dr. Julio Marín Aguado<br>
      Universidad de Valparaíso & GT DOCA<br>
      Contacto: <a href="mailto:ofmc2026@gmail.com" style="color: #0284c7;">ofmc2026@gmail.com</a> | Web: <a href="https://www.doca2026.cl" style="color: #0284c7;">www.doca2026.cl</a><br>
      Sede: Facultad de Ciencias Sociales (FACSO), Hontaneda 2653, Valparaíso.
    </div>
  </div>
</body>
</html>
"""

        msg = MIMEMultipart("mixed")
        msg["From"] = f"Comité Organizador OFMC 2026 <{CORREO_OFICIAL}>"
        msg["To"] = f"{nombre} <{correo}>"
        msg["Subject"] = "Programa Oficial Preliminar y Aplicación Móvil - VIII Congreso OFMC 2026 Valparaíso"

        msg_alt = MIMEMultipart("alternative")
        msg_alt.attach(MIMEText(text_body, "plain", "utf-8"))
        msg_alt.attach(MIMEText(html_body, "html", "utf-8"))
        msg.attach(msg_alt)

        part = MIMEApplication(pdf_bytes, Name="Programa_Detallado_OFMC2026.pdf")
        part["Content-Disposition"] = 'attachment; filename="Programa_Detallado_OFMC2026.pdf"'
        msg.attach(part)

        enviado = False
        for intento in range(1, 4):
            try:
                server.sendmail(CORREO_OFICIAL, [correo], msg.as_string())
                enviado = True
                break
            except Exception as err:
                print(f"  [Reintento {intento}] Error con {correo}: {err}. Reconectando...")
                time.sleep(2)
                try:
                    server = connect_smtp()
                except Exception as conn_err:
                    print(f"  [Fallo de reconexión]: {conn_err}")
                    time.sleep(3)

        if enviado:
            print(f"[{idx:3d}/{len(destinatarios)}] ENVIADO: {nombre} <{correo}>")
            with open(log_path, "a", encoding="utf-8") as f_log:
                f_log.write(f"{correo}\t{nombre}\t{time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            total_enviados += 1
            time.sleep(0.8)
        else:
            print(f"[{idx:3d}/{len(destinatarios)}] ERROR DEFINITIVO con {nombre} <{correo}>")
            errores.append(correo)

finally:
    if server:
        try:
            server.quit()
        except:
            pass

print("\n==================================================================")
print("RESUMEN DE DESPACHO CLOUD:")
print(f"  Total procesados: {len(destinatarios)}")
print(f"  Enviados exitosamente: {total_enviados}")
if errores:
    print(f"  Errores ({len(errores)}): {errores}")
print("==================================================================")
