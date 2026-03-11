close all
clear


%lee los datos de marea del sector
pathn='C:\Users\Manuel\Dropbox\FACIMAR\Datos\DATA_ANILLOENE2\enero_2025\anclaje_temporal\'; %'C:\Users\Manuel\Dropbox\FACIMAR\Datos\DATA_ANILLOENE2\recuperacion_junio\';
filen='ctdsuperficial_5258_data_20250116_060000.csv';
%filen='56b1_data_20250116_060000.csv';


d=importdata([pathn '/' filen]);

%ind=1172:2944;
%ind=1:length(d);

cond=d.data(:,1);
temp=d.data(:,2);
prof=d.data(:,3);
sali=d.data(:,4);

lat=-54.442194;
lon=-69.051667;
%aca la fecha


fech=datenum(d.textdata(2:end,1));
dt=(fech(2)-fech(1))*24*60;

%busco la rpofundidad minima
prfMIN=min(prof);


ind=1170:2944; %para los datos superficie

xtick=fix(fech(ind(1))):fix(fech(ind(end)));
xlim=[datenum(2025,1,20,08,00,00) datenum(2025,1,26,08,59,59)];

H=figure('visible','on','Units', 'Normalized','Position',[0.05 0.1 .8 .8]);

h=axes('position',[.1 .66 .85 .27]);
plot(fech(ind),prof(ind),'k')
ylabel('Depth range [m]')
set(h,'xlim',xlim,'xtick',xtick,'xticklabel','')

h=axes('position',[.1 .35 .85 .27]);
plot(fech(ind),temp(ind),'r')
ylabel('Temp. [ºC]')
set(h,'xlim',xlim,'xtick',xtick,'xticklabel','')
set(h,'color','none')
set(h,'box','off')
set(h,'xaxislocation','top')
set(h,'ycolor','r')
set(h,'yaxislocation','left')

%aca leo el miniDOT -----------------------------------------
pathn1='C:\Users\Manuel\Dropbox\FACIMAR\Datos\DATA_ANILLOENE2\enero_2025\MINIDOTs_proceso01\';
a=load([pathn1 'minidot_superf_1512025_2612025.dat']);

fech1=datenum(a(:,1:6));
Do1=a(:,9);

h=axes('position',[.1 .35 .85 .27]);
fech1=fech1-3/24; %los datos DO estan en horario local
plot(fech1,Do1,'color',[.1 .3 .7]) 
set(h,'color','none')
set(h,'box','off')
set(h,'xaxislocation','bottom')
set(h,'yaxislocation','right')
set(h,'xlim',xlim,'xtick',xtick,'xticklabel','')
set(h,'ycolor',[.1 .3 .7])
ylabel('DOx. [mg mL^-^1]')

%----------------------------------------------------------

h=axes('position',[.1 .05 .85 .27]);
plot(fech(ind),sali(ind),'color',[.3 .6 .3])
ylabel('Sal. [g kg^-^1]')
set(h,'xlim',xlim,'xtick',xtick,'xticklabel',datestr(xtick,'dd'))

pathn1='C:\Users\Manuel\Dropbox\00papers\047_seno_almirantazgo\fig\';
eval(['print -dtiff -r300 ' pathn1 'serie_superficie'])


eval(['save ' pathn 'anclaje_sup fech fech1 sali Do1 prof temp ind']) 





return
%RETURN
prof=(prof-prfMIN)*100;
% p=hanning(21);
% p=p/sum(p);
% proff=yfilter(prof,p);
% 
% plot(prof)
% hold on
% plot(proff,'r')

%
%[name,fr,tidecon,eout]=t_tide(dat(:,1)*100,'int',dt/60,'start',fech(1),'latitude',lat,'error','linear','synthesis',1,'output',[fout]);
[name,fr,tidecon,eout]=t_tide(prof,'int',dt/60,'start',fech(1),'latitude',lat,'error','linear','synthesis',1);

%return
obs=prof;

%pronostica para el periodo completo
%fp=fech(1)-1:1/144:fix(fech(end))+1);
%pout=t_predic(fech,name,fr,tidecon,lat);
prd=eout+nanmean(obs);

figure
plot(fech,obs)
hold on
plot(fech,prd,'r')


return
addpath('C:\marea2mat')


addpath('C:\manuel\t_tide2018')
%ahora los uso para hacer pronostico de la zona
year=2024;
lugar='Cta. Maria';
ini=datenum(year-1,12,31,00,00,00); %lo hago un dia antes y un dia despues
fin=datenum(year+1,01,01,23,59,59); %del año de interes
NMM=nanmean(prof);

[MAT,pron]=pron_tabla(year,name,fr,tidecon,lat,NMM,[]);
crea_tabla2('2024',MAT,lugar);



figure
plot(pron(:,1),pron(:,2))
hold on
plot(fech,prof,'r')
%mat=llenagaps1(obs,prd,100000);
%plot(fech,mat)

%figure


%eval(['save C:\Users\Manuel\Dropbox\01tesistas\2024.ConstanzaEscobedo\data\mareas\' est ' fech mat'])

