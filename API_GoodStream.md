Información de la cuenta
PEDIDO
https://goodstream.one/api/account/info?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
RESPUESTA
{
		    "msg": "OK",
		    "server_time": "2021-09-11 04:30:07",
		    "estado": 200,
		    "resultado": {
		    	"archivos_total":"31",
		    	"almacenamiento_izquierdo":1288483337,
		    	"login":"megauploader21",
		        "correo electrónico": " megauploader21@gmail.com ",
		        "premium_expire":"2022-10-15 04:46:59",
		        "balance":"108.00000",
		        "premium":1,
		        "almacenamiento_usado":685101"
		    }
		}
Estadísticas de la cuenta
PEDIDO
https://goodstream.one/api/account/stats?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
último	Mostrar estadísticas de los últimos X días (predeterminado: 7)	14	INT	
RESPUESTA
{
		  "msg": "OK",
		  "server_time": "2021-09-13 04:30:07",
		  "estado": 200,
		  "resultado": [
		    {
		      "descargas": "0",
		      "profit_views": "0.00000",
		      "views_adb": "1",
		      "ventas": "0",
		      "profit_sales": "0.00000",
		      "profit_refs": "0.00000",
		      "profit_site": "0.00000",
		      "vistas": "0",
		      "refs": "0",
		      "día": "2021-09-12",
		      "profit_total": "0.00000",
		      "views_prem": "0"
		    }
		  ]
		}
Obtener servidor de carga
PEDIDO
https://goodstream.one/api/upload/server?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
RESPUESTA
{
		  "msg": "OK",
		  "server_time": "2021-08-11 04:29:54",
		  "estado": 200,
		  "resultado": "https://s1.myvideo.com/upload/01"
		}
Subir archivo al servidor
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
archivo	Archivo(s) de vídeo	1.avi	ARCHIVO	
título_archivo	Título del video	Vídeo de lanzamiento nuevo	CADENA	
descripción_archivo	Descripción del video	Esta es una muestra de
nuestro próximo lanzamiento.	CADENA	
instantánea	Captura de pantalla de vídeo personalizada (hasta 300 KB)	1.jpg	ARCHIVO	
fld_id	ID de carpeta	25	INT	
id_de_gato	ID de categoría	5	INT	
etiquetas	Lista de etiquetas	promoción, alta calidad	CADENA	
archivo_público	Bandera pública	1	INT	
archivo_adulto	Bandera para adultos	1	INT	
html_redirect	Utilice la salida de redirección HTML de estilo antiguo en lugar de JSON.	1	INT	
Ejemplo mínimo de carga de formulario HTML:
<form method="POST" enctype="multipart/form-data" action="https://s1.myvideo.com/upload/01">
		<input type="hidden" name="key" value="7014cvf28z4f8btovjg">
		<input type="hidden" name="html_redirect" value="1">
		<input type="file" name="file">
		<input type="submit">
		</form>
Ejemplo de carga de archivos CURL: Sube 2 vídeos:
curl -X POST -F 'key=7014cvf28z4f8btovjg' -F ' file=@1.avi ' -F ' file=@2.avi ' https://s1.myvideo.com/upload/01
Sube un vídeo con título personalizado y captura de pantalla:
curl -X POST -F 'key=1l5ftrilhllgwx2bo' -F 'file_title="Hola!"' -F ' file=@1.avi ' -F ' snapshot=@1.jpg ' http://s1.xvs.tt/upload/01
Respuesta:
{
		    "msg": "OK",
		    "estado": 200,
		    "archivos": [{
		        "archivocode": "u9150wqzvhxj",
		        "nombre de archivo": "1.avi",
		        "estado": "OK"
		    }, {
		        "código de archivo": "gzky98gfg6hn",
		        "nombre de archivo": "2.avi",
		        "estado": "OK"
		    }]
		}
Subir por URL
PEDIDO
https://goodstream.one/api/upload/url?key=7014cvf28z4f8btovjg&url= {url}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
URL	URL del archivo de vídeo	http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4	CADENA	
fld_id	ID de carpeta	25	INT	
id_de_gato	ID de categoría	5	INT	
archivo_público	Bandera pública	1	INT	
archivo_adulto	Bandera para adultos	1	INT	
etiquetas	Lista de etiquetas	promoción, alta calidad	CADENA	
RESPUESTA Devuelve un código de archivo futuro que funcionará después de que se complete la carga.
{
			"msg":"OK",
			"server_time":"2021-08-12 20:56:47",
			"estado":200,
			"resultado":{
				"archivocódigo":"fb5asfuj2snh"
			}
		}
Información del archivo
PEDIDO
https://goodstream.one/api/file/info?key=7014cvf28z4f8btovjg&file_code= {file_code}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	código de archivo o lista separada por comas	gi4o0tlro01u,gi4o0tlro012	CADENA	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-12 21:10:07",
			"estado":200,
			"resultado":[
				{
				"file_views_full":"0",
				"cat_id":"3",
				"player_img":"http://img.xvs.tt/fb5asfuj2snh.jpg",
				"estado":200,
				"file_code":"fb5asfuj2snh",
				"archivo_última_descarga":2021-08-12 20:56:54",
				"puede jugar":1,
				"archivo_público":"1",
				"file_length":"60",
				"file_title":"big buck bunny",
				"file_views":"0",
				"archivo_creado":2021-08-102 20:51:52",
				"file_premium_only":"0",
				"archivo_adulto":"1",
				"file_fld_id":"25",
				"etiquetas":"promo, alta calidad"
				}
			]
		}
Editar archivo
PEDIDO
https://goodstream.one/api/file/edit?key=7014cvf28z4f8btovjg&file_code= {file_code} &file_title= {file_title}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	Código de archivo o lista separada por comas	gi4o0tlro01u,hqpibyqwxumrt	CADENA	
título_archivo	Título del archivo	Los 100 S01E02	CADENA	
descripción_archivo	Descripción del archivo	Lanzamiento de MegaDrive	CADENA	
id_de_gato	ID de categoría	5	INT	
ID de archivo	ID de carpeta	25	INT	
archivo_público	Bandera pública	1	INT	
archivo_adulto	Bandera para adultos	0	INT	
etiquetas	Etiquetas de archivo	promoción, alta calidad	CADENA	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-13 20:17:12",
			"estado":200,
			"resultado":"verdadero"
		}
Lista de archivos
PEDIDO
https://goodstream.one/api/file/list?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
fld_id	ID de carpeta	25	INT	
título	Filtrar vídeos por título	Hombre de hierro	CADENA	
creado	Mostrar solo los vídeos subidos después de la marca de tiempo.
Especifique el número para mostrar los vídeos subidos hace X minutos.	2021-07-21 05:07:10	CADENA	
público	Mostrar solo videos públicos (1) o privados (0), dejar vacío para mostrar todos.	1	INT	
adulto	Mostrar solo videos para adultos (1) o seguros (0), dejar vacío para mostrar todos.	0	INT	
por página	Número de resultados por página	50	INT	
página	Número de página	2	INT	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-13 20:35:18",
			"estado":200,
			"resultado":
			{
				"archivos":[
					{
						"miniatura":"http://img.xvs.tt/fb5asfuj2snh_t.jpg",
						"link":"http://xvs.tt/fb5asfuj2snh.html",
						"file_code":"fb5asfuj2snh",
						"puede jugar":1,
						"longitud":"60",
						"vistas":"0",
						"subido":"2021-07-12 20:56:54",
						"público":"0",
						"fld_id":"0",
						"título":"Prueba 123"
					}
				],
				"resultados_total":9,
				"páginas":9,
				"resultados":1
			}
		}
Enlace directo al archivo
PEDIDO
https://goodstream.one/api/file/direct_link?key=7014cvf28z4f8btovjg&file_code= {file_code}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	Código de archivo	fb5asfuj2snh	CADENA	
q	Calidad de vídeo, si está disponible. Valores posibles: n, h, l, o	norte	CADENA	
hls	Generar URL de manifiesto HLS (se requiere el módulo HLS)	1	INT	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-14 05:32:27",
			"estado":200,
			"resultado":
			{
				"versiones":[
					{"url":"http://s1.xvs.tt/zqsccwdttqsal2eyd2pjrlvodgh7iyejldkogrnzwypvlnajbosxsuchfurq/v.mp4","name":"n","size":"120755726"},
					{"url":"http://s1.xvs.tt/zqsccwdttqsal2eyd2pjrlvodgh7iyejldkogrnzwapvlnajbostzwskpx4a/v.mp4","name":"h","size":"135481436"},
					{"url":"http://s1.xvs.tt/zqsccwdttqsal2eyd2pjrlvodgh7iyejldkogrnzwqpvlnajbosrpvmuh5la/v.mp4","nombre":"l","tamaño":"34744877"},
					{"url":"http://s1.xvs.tt/zqsccwdttqsal2eyd2pjrlvodgh7iyejldkogrnzw4pvlnajbosyx264xtsq/v.mp4","name":"o","size":"319256576"}
				],
				"file_length":"1560",
				"player_img":"http://img.xvs.tt/abnormamorph.jpg",
				"hls_direct":"http://s1.xvs.tt/hls/zqsccwdttqsal2eyd2pjrlvodgh7iyejldkogrnzw,qpvlnajbosrpvmuh5la,ypvlnajbosxsuchfurq,apvlnajbostzwskpx4a,.urlset/master.m3u8"
			}
		}
Clonar archivo
PEDIDO
https://goodstream.one/api/file/clone?key=7014cvf28z4f8btovjg&file_code= {file_code}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	Código del archivo fuente	abnormamorfo	CADENA	
título_archivo	Nuevo título de archivo si es necesario	Nuevo título de vídeo	CADENA	
fld_id	ID de la carpeta de destino	5	INT	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-14 19:39:58",
			"estado":200,
			"resultado":
			{
				"url":"http://xvs.tt/u405p6qz5xpi",
				"archivocódigo":"u405p6qz5xpi"
			}
		}
Eliminar archivo
PEDIDO
https://goodstream.one/api/file/delete?key=7014cvf28z4f8btovjg&file_code= {file_code}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	Código de archivo	abnormamorfo	CADENA	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-14 19:39:58",
			"estado":200
		}
Archivos eliminados
Obtener la lista de archivos eliminados recientemente

PEDIDO
https://goodstream.one/api/file/deleted?key=7014cvf28z4f8btovjg&last= {last}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
último	Mostrar archivos eliminados en las últimas X horas	24	INT	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-15 19:04:06",
			"estado":200,
			"resultado":[
				{
					"file_code":"38j4wvxw164d",
					"eliminado_por":"yo",
					"eliminado_hace_segundos":"40",
					"eliminado":2021-08-15 19:03:26",
					"título":"Video 109779195"
				}
			]
		}
Presentar una denuncia DMCA
Obtenga archivos programados para su eliminación por DMCA.

PEDIDO
https://goodstream.one/api/file/dmca?key=7014cvf28z4f8btovjg&last= {last}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
último	Mostrar archivos reportados en las últimas X horas solamente	24	INT	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-15 19:31:48",
			"estado":200,
			"resultado":[
				{
					"file_code":"x2q5h0uhfzdu",
					"del_in_sec":"42097",
					"del_time": "2021-08-16 07:13:25"
				}
			]
		}
Lista de carpetas
PEDIDO
https://goodstream.one/api/folder/list?key=7014cvf28z4f8btovjg&fld_id= {fld_id} &files=1
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
fld_id	ID de la carpeta principal, valor predeterminado=0	25	INT	
archivos	Mostrar la lista de archivos en esta carpeta	1	INT	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-15 19:54:22",
			"estado":200,
			"resultado":{
				"carpetas":[
					{
						"nombre":"Breaking Bad",
						"fld_id":"16",
						"código":"4pwb4yvp7v"
					},
					{
						"nombre":"Travis",
						"fld_id":"15",
						"código":"68dth39m76"
					}
				],
				"archivos":[
					{
						"miniatura":"http://img.xvs.tt/abnormamorph_t.jpg",
						"link":"http://xvs.tt/abnormamorph.html",
						"archivo_código":"abnormamorph",
						"puede jugar":1,
						"longitud":"1560",
						"vistas":"10",
						"subido":"2021-08-20 20:37:22",
						"público":"0",
						"fld_id":"0",
						"title":"Tri pljus dva 2012 SATRip"
					}
				]
			}
		}
Crear carpeta
PEDIDO
https://goodstream.one/api/folder/create?key=7014cvf28z4f8btovjg&name= {name} &parent_id= {parent_id}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
nombre	Nombre de la carpeta	Nuevos vídeos	CADENA	
id_padre	ID de la carpeta principal	0	INT	
descripción	Descripción de la carpeta	cosas nuevas	CADENA	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-18 20:32:46",
			"estado":200,
			"resultado":
			{
				"fld_id":"29"
			}
		}
Edición de carpeta
Actualizar detalles de la carpeta; los campos omitidos no se actualizarán.

PEDIDO
https://goodstream.one/api/folder/edit?key=7014cvf28z4f8btovjg&fld_id= {fld_id} &name= {name}
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
fld_id	ID de carpeta	25	INT	
nombre	Nombre de la carpeta	Películas 2021	CADENA	
id_padre	ID de la carpeta principal	0	INT	
descripción	Descripción de la carpeta	cosas viejas	CADENA	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-18 21:21:44",
			"estado":200,
			"resultado":"verdadero"
		}
Codificaciones de archivos
Obtener las colas de codificación actuales

PEDIDO
https://goodstream.one/api/file/encodings?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	Filtrar por código de archivo	fb5asfuj2snh	CADENA	
RESPUESTA
{
			"msg":"OK",
			"server_time":"2021-08-18 21:44:09",
			"estado":200,
			"resultado":[
				{"link":"http://xvs.tt/fb5asfuj2snh.html,"progress":15,"status":"ENCODING,"title":"Test video,"quality":"h,"file_code":"fb5asfuj2snh"},
				{"link":"http://xvs.tt/fb5asfuj2snh.html,"progress":0,"status":"PENDING,"title":"Test video,"quality":"l,"file_code":"fb5asfuj2snh"}
			]
		}
Cargas de URL de archivos
Obtener las colas de codificación actuales

PEDIDO
https://goodstream.one/api/file/url_uploads?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
código_archivo	Filtrar por código de archivo	fb5asfuj2snh	CADENA	
RESPUESTA
{
			"solicitudes_disponibles":2,
			"msg":"OK",
			"server_time":"2022-06-14 20:30:20",
			"estado":200,
			"resultado":[
				{"remote_url":"https://xvs.tt/1.mp4","progress":0,"status":"PENDING","file_code":"","fld_id":"0"},
				{"remote_url":"https://xvs.tt/2.mp4","progress":0,"status":"PENDING","file_code":"xyayxm9ajlys","fld_id":"7"}
			]
		}
Acciones de carga de URL de archivos
Obtener las colas de codificación actuales

PEDIDO
https://goodstream.one/api/file/url_actions?key=7014cvf28z4f8btovjg
PARÁMETROS
Nombre	Descripción	Ejemplo	Formato	Requerido
llave	clave API	7014cvf28z4f8btovjg	CADENA	
errores_de_reinicio	Reiniciar todas las cargas fallidas	1	INT	
eliminar_errores	Eliminar todas las cargas fallidas	1	INT	
eliminar todo	Eliminar todas las cargas actuales	1	INT	
eliminar_código	Eliminar archivos subidos específicos mediante código	xyayxm9ajlys,6bnyg8rnu11e	CADENA	
RESPUESTA
{
			"solicitudes_disponibles":2,
			"msg":"OK",
			"server_time":"2022-06-14 20:30:20",
			"estado":200
		}