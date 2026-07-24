Introducción

DoodStream proporciona una API HTTP sencilla para integrar la nuestra en su negocio o aplicación.Todas las solicitudes a la API deben ser únicamente de tipo GET o POST.Puede encontrar su clave API aquí: https://doodstream.com/settings

límites de velocidadLas solicitudes a la API están limitadas a 10 por segundo; para más solicitudes, contáctenos.

Respuesta{"msg":"Demasiadas solicitudes,"status":"429"}CuentaInformación de la cuentaObtén información básica de tu cuenta.

GEThttps://doodapi.co/api/account/info?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": {"correo electrónico": "correo@test.com","balance": "0.00000","almacenamiento_usado" :"24186265","almacenamiento_izquierdo": 128824832615,"premim_expire": "2025-10-24 21:00:00}}Informes de cuentaObtén informes de tu cuenta (por defecto, los últimos 7 días).

GEThttps://doodapi.co/api/account/stats?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISílastInforme de los últimos x díasNofrom_dateFecha de inicio: AAAA-MM-DDNoto_dateHasta la fecha - AAAA-MM-DDNoRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"profit_views": "0.00000","descargas": "0","vistas": "0","día": "2017-08-11","profit_total": "0.00000"},{"profit_views": "0.00000","descargas": "0","vistas": "0","día": "2017-08-12","profit_total": "0.00000"}]}Lista DMCAObtenga la lista de archivos denunciados por DMCA (500 resultados por página).

GEThttps://doodapi.co/api/dmca/list?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISíper_pageResultados por página (valor predeterminado: 500)NopagePaginaciónNoRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"reported_on": "2017-08-11 04:30:07","descarga_protegida": "aaa","protected_embed": "zzz","archivo_código": "xxx","fld_id": "0","disabled_on": "2017-08-11 05:00:07"}]}SubirCarga localCarga archivos locales mediante la API.

GEThttps://doodapi.co/api/upload/server?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": "https://xxx.cloudatacdn.com/upload/01"}Ejemplo de uso (cURL)curl -X POST -F 'api_key={tu_clave_api}' -F 'file=@file.mp4' https://xxx.cloudatacdn.com/upload/01?{tu_clave_api}Ejemplo de uso (HTML)

<form enctype="multipart/form-data" action="https://xxx.cloudatacdn.com/upload/01?{your_api_key}" method="post">
<input type="hidden" name="api_key" value="{your_api_key}">
<input name="file" type="file">
<input type="submit">
</form>
Después de cargar la respuesta
{
  "msg": "OK",
  "server_time": "2017-08-11 04:30:07",
  "estado": 200,
  "resultado": [
    {
      "download_url": "https://dood.to/d/xxx",
      "single_img": "https://img.doodcdn.io/snaps/xxx.jpg",
      "estado": 200,
      "archivocode": "xxx",
      "splash_img": "https://img.doodcdn.io/splash/xxx.jpg",
      "canplay": 1,
      "tamaño": "123456",
      "longitud": "123456",
      "subido": "2017-08-11 04:30:07",
      "protected_embed": "https://dood.to/e/yyy",
      "protected_dl": "https://dood.to/d/zzz",
      "título": "archivo_de_prueba"
    }
  ]
}
Copiar o clonar
Copia/Clona tu archivo o el de otra persona.

GEThttps://doodapi.co/api/file/clone?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivoSífld_idID de la carpeta (para copiar dentro de la carpeta)NoRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": {"embed_url": "https://dood.la/e/xxx","download_url": "https://dood.la/d/xxx","protected_download": "https://dood.la/d/yyy","protected_embed": "https://dood.la/e/zzz","archivocode": "xxx"}}Carga remotaAgregar enlaceSube archivos usando enlaces directos

GEThttps://doodapi.co/api/upload/url?key={tu_clave_api}&url={url_de_carga}ParámetroDescripciónRequeridokeyTu clave APISíurlURL para subirSífld_idPara subir dentro de una carpetaNonew_titlePara establecer un nuevo títuloNoRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","new_title": "","estado": 200,"total_slots": "100","resultado": {"archivocode": "98zukoh5jqiw"},"ranuras usadas": "0"}Lista de carga remotaLista y estado de carga remota

GEThttps://doodapi.co/api/urlupload/list?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"bytes_total": "0","creado": "2017-08-11 04:30:07","remote_url": "https://dropbox.com/hukbasd7k3fd","estado": "trabajando","file_code": "98zukoh5jqiw","bytes_descargados": "0","folder_id": "0"}]}Estado de carga remotaEstado de carga remota

GEThttps://doodapi.co/api/urlupload/status?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivo del archivoSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"bytes_total": "0","creado": "2017-08-11 04:30:07","remote_url": "https://dropbox.com/hukbasd7k3fd","estado": "trabajando","archivo_código": "hjsnr087johj","bytes_descargados": "0","folder_id": "0"}]}Ranuras de carga remotaObtenga el total y los espacios de carga remota utilizados.

GEThttps://doodapi.co/api/urlupload/slots?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"total_slots": "100","ranuras usadas": "10"}Acciones de carga remotaRealizar diversas acciones en la carga remota

GEThttps://doodapi.co/api/urlupload/actions?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISírestart_errorsReiniciar todos los erroresSíclear_errorsBorrar todos los erroresNoclear_allBorrar todoNodelete_codeEliminar una transferencia, pasar el código del archivoNoRespuesta{"msg": "Errores reiniciados","server_time": "2017-08-11 04:30:07","estado": 200}Administrar carpetasCrear carpetaCrear una carpeta

GEThttps://doodapi.co/api/folder/create?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISínameNombre de la carpetaSíparent_idID de la carpeta principalNoRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": {"fld_id": "1234567"}}Cambiar el nombre de la carpetaEnumerar todas las carpetas

GEThttps://doodapi.co/api/folder/cambiarnombre?clave={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífld_idID de carpetaSínameNuevo nombre de la carpetaSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": "verdadero"}Listar carpetas y archivosEnumerar todas las carpetas

GEThttps://doodapi.co/api/folder/list?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífld_idID de carpetaSíonly_foldersPara listar solo las carpetas (0 o 1)NoRespuesta{"msg":"OK","estado":200,"resultado":{"carpetas":[{"nombre":"Nombre de la carpeta","código":"67299gduj3","fld_id":"123"},],"archivos": [{"download_url": "https://dood.to/d/xxx","single_img": "https://img.doodcdn.io/snaps/xxx.jpg","archivo_código": "xxx","canplay": 1,"longitud": "1234","vistas": "1","subido": "2017-08-11 04:30:07","público": "1","fld_id": "0","título": "archivo_de_prueba"}],},"server_time":"2023-10-17 07:31:01"}

Administrar archivosListar archivosListar todos los archivos

GEThttps://doodapi.co/api/file/list?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISípagePaginaciónNoper_pageNúmero máximo de vídeos por página (máximo 200)Nofld_idVídeos dentro de una carpetaNocreatedMostrar archivos subidos después de la marca de tiempo (Ej.: 2021-10-07 03:15:19)O especificar un número para mostrar solo los archivos subidos hace X minutosNoRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": {"total_pages": 1,"archivos": [{"download_url": "https://dood.to/d/xxx","single_img": "https://img.doodcdn.io/snaps/xxx.jpg","archivo_código": "xxx","canplay": 1,"longitud": "1234","vistas": "1","subido": "2017-08-11 04:30:07","público": "1","fld_id": "0","título": "archivo_de_prueba"}],"resultados_total": "1","resultados": 1}}Estado del archivoComprueba el estado de tu archivo.

GEThttps://doodapi.co/api/file/check?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivoSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"estado": "Activo","archivocode": "xxx"}]}Información del archivoObtener información del archivo

GEThttps://doodapi.co/api/file/info?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivoSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"single_img": "https://img.doodcdn.io/snaps/xxx.jpg","estado": 200,"archivocode": "xxx","splash_img": "https://img.doodcdn.io/splash/xxx.jpg","canplay": 1,"tamaño": "123456","vistas": "0","longitud": "123456","subido": "2017-08-11 04:30:07","last_view": "","protected_embed": "/e/yyy","protected_dl": "/d/zzz","título": "archivo_de_prueba"}]}Imagen de archivoObtenga la imagen de inicio del archivo, imagen individual o miniatura.

GEThttps://doodapi.co/api/file/image?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivoSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": [{"estado": 200,"archivocode": "xxx","título": "archivo_de_prueba","single_img": "https://img.doodcdn.io/snaps/xxx.jpg","thumb_img": "https://img.doodcdn.io/thumbnails/xxx.jpg","splash_img": "https://img.doodcdn.io/splash/xxx.jpg"}]}Cambiar nombre del archivoCambia el nombre de tu archivo.

GEThttps://doodapi.co/api/file/rename?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivoSítitleNuevo nombre de archivoSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": "verdadero"}Traslado de archivosMueva su archivo de una carpeta a otra.

GEThttps://doodapi.co/api/file/move?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISífile_codeCódigo de archivoSífld_idID de la carpeta a la que mover el archivo (establecer 0 para el directorio /)SíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": "verdadero"}Búsqueda de archivosBuscar en tus archivos

GEThttps://doodapi.co/api/search/videos?key={tu_clave_api}ParámetroDescripciónRequeridokeyTu clave APISísearch_termtérmino de búsquedaSíRespuesta{"msg": "OK","server_time": "2017-08-11 04:30:07","estado": 200,"resultado": "verdadero"}ExtrasImagen de salpicadura remotaCargar la imagen de inicio directamente a través de la URL

URLhttps://dood.so/e/xxx?c_poster=https://example.com/image.jpgParámetroDescripciónRequeridoc_posterImagen de salpicaduraSíSubtítulos remotosCargar varios subtítulos directamente a través de la URL

URLhttps://dood.so/e/xxx?c1_file=https://example.com/sub.vtt&c1_label=EnglishParámetroDescripciónRequeridoc1_fileURL de los subtítulos (srt o vtt)Síc1_labelIdioma del subtítulo o cualquier etiquetaSíSubtítulo remoto JSONCargar varios subtítulos mediante URL en formato JSON.

URLhttps://dood.so/e/xxx?subtitle_json=https://example.com/sub.jsonParámetroDescripciónRequeridosubtitle_jsonMúltiples subtítulos en formato JSONSíEjemplo de JSON para subtítulos remotos[{"src":"https://example.com/name_en.vtt", "label":"English", default: true},{"src":"https://example.com/name_fr.vtt", "label":"Francés"}]ClientelaCliente PHP no oficialGITHUBhttps://github.com/Marchay/doodstream-PHP-libraryCliente Python no oficialpypihttps://pypi.org/project/doodstream/