PRD – Plataforma de Streaming de Películas (MVP)
1. Visión General del Proyecto

El objetivo de este proyecto es desarrollar una plataforma web de streaming de películas con una experiencia moderna, rápida e intuitiva, inspirada en las mejores prácticas de plataformas como Netflix en cuanto a navegación, organización del contenido y facilidad de uso. La prioridad del proyecto es ofrecer una interfaz limpia donde cualquier visitante pueda acceder al catálogo y reproducir películas de forma inmediata, sin necesidad de crear una cuenta o iniciar sesión durante la primera versión del producto.

La plataforma estará dividida en dos grandes módulos completamente independientes: un sitio público orientado a los visitantes y un panel de administración privado desde el cual el administrador podrá gestionar absolutamente todo el contenido del sistema. Esta separación permitirá mantener una arquitectura organizada, segura y escalable.

En esta primera etapa todas las películas estarán disponibles de forma gratuita. Sin embargo, toda la arquitectura deberá diseñarse pensando en futuras versiones del producto, donde será posible incorporar usuarios registrados, perfiles personales, historial de reproducciones, listas de favoritos, recomendaciones inteligentes, suscripciones Premium y otros servicios sin necesidad de reconstruir la aplicación desde cero.

Los archivos de video no serán almacenados dentro del servidor del proyecto. Toda la gestión de almacenamiento, procesamiento y reproducción de los videos será delegada a Vimeus mediante su API oficial. El sistema únicamente almacenará los identificadores y la información necesaria para reproducir cada película.

2. Objetivos del MVP

La primera versión del sistema deberá enfocarse exclusivamente en validar el funcionamiento de la plataforma y facilitar la administración del catálogo. El objetivo principal es que el administrador pueda publicar películas en pocos minutos y que cualquier visitante pueda encontrarlas y reproducirlas sin complicaciones.

Durante esta primera etapa el sistema deberá permitir administrar un catálogo completo de películas, importar automáticamente información desde TMDb para reducir el trabajo manual, subir videos mediante la API de Vimeus, organizar el contenido por categorías, destacar determinadas películas en la página principal y reproducir el contenido desde el reproductor integrado.

No se desarrollarán funcionalidades relacionadas con usuarios finales como registro, inicio de sesión, favoritos, comentarios, puntuaciones, historial de reproducción o suscripciones. Estas características formarán parte de futuras versiones del proyecto.

3. Arquitectura General

La arquitectura estará compuesta por cuatro componentes principales.

El primer componente será el Frontend Público, desarrollado en React, encargado de mostrar el catálogo, las fichas de películas y el reproductor.

El segundo componente será el Panel de Administración, también desarrollado en React, pero completamente independiente del sitio público y protegido mediante autenticación.

El tercer componente será un Backend desarrollado en Node.js, encargado de centralizar toda la lógica del sistema, comunicarse con la base de datos, gestionar la autenticación del administrador y servir como intermediario entre la aplicación y los servicios externos.

El cuarto componente será la base de datos PostgreSQL utilizando Supabase, donde se almacenará toda la información del catálogo, configuraciones, categorías y administración.

El Backend será el único autorizado para comunicarse con APIs externas. En ningún caso el Frontend accederá directamente a Vimeus ni a TMDb. Esto garantiza la seguridad de las credenciales y facilita el mantenimiento de la aplicación.

4. Tecnologías

El Frontend será desarrollado utilizando React junto con React Router para la navegación y TailwindCSS para el diseño de la interfaz.

El Backend será construido con Node.js y Express, implementando una API REST que centralizará toda la lógica del negocio.

La base de datos utilizará PostgreSQL mediante Supabase.

Para la gestión del contenido multimedia se integrará la API de Vimeus, responsable del almacenamiento, procesamiento y reproducción de los videos.

Para completar automáticamente la información de cada película se utilizará la API de TMDb, permitiendo importar datos como sinopsis, actores, director, géneros, imágenes y trailers.

5. Sitio Público

El sitio público será la cara visible de la plataforma y estará diseñado para ofrecer una experiencia de navegación rápida, intuitiva y visualmente atractiva.

La página principal mostrará un gran banner destacado ocupando la parte superior de la pantalla. Este banner presentará una película seleccionada por el administrador e incluirá una imagen de fondo de alta calidad, el título, una breve sinopsis y un botón para comenzar la reproducción.

Debajo del banner aparecerán diferentes filas de películas organizadas por categorías como Estrenos, Acción, Comedia, Drama, Ciencia Ficción, Terror, Animación y cualquier otra categoría creada desde el panel administrativo.

El encabezado del sitio incluirá el logotipo de la plataforma, un buscador de películas y un menú de navegación simple.

El buscador permitirá localizar contenido utilizando el título, actores, director o género, mostrando resultados de forma rápida y precisa.

Cada película tendrá una página propia donde se mostrará toda la información disponible: título, título original, sinopsis completa, duración, año de estreno, clasificación por edades, país de origen, director, reparto, idiomas disponibles, géneros, trailer oficial y un botón principal para reproducir la película.

Al presionar el botón "Ver Ahora", el sistema obtendrá desde el Backend el identificador del video almacenado en Vimeus y cargará el reproductor correspondiente para iniciar la reproducción.

6. Panel de Administración

El panel administrativo será una herramienta pensada exclusivamente para un único administrador, por lo que su diseño priorizará la simplicidad y la velocidad antes que la cantidad de funciones.

La filosofía del panel será que cualquier tarea importante pueda realizarse en pocos clics y que la interfaz resulte comprensible incluso después de largos períodos sin utilizarla.

El acceso al panel estará protegido mediante un sistema de autenticación con usuario y contraseña. Una vez iniciada la sesión, el administrador accederá a un Dashboard con información resumida sobre el estado de la plataforma.

El Dashboard mostrará únicamente los indicadores realmente importantes, como la cantidad de películas publicadas, películas ocultas, videos en proceso de conversión, total de reproducciones y la última película incorporada al catálogo.

No se incluirán gráficos complejos ni estadísticas innecesarias durante esta primera versión.

7. Gestión de Películas

La sección de películas será el núcleo del panel administrativo.

Se mostrará una tabla clara y ordenada con el poster de cada película, su título, año, estado de publicación, cantidad de reproducciones, fecha de creación y acciones disponibles para editar, ocultar o eliminar el contenido.

En la parte superior existirá un buscador para localizar rápidamente cualquier película y un botón principal denominado "Nueva Película".

Al crear una nueva película el administrador accederá a un formulario dividido en bloques bien organizados para facilitar la carga de información.

El primer bloque contendrá todos los datos generales como título, título original, sinopsis, año, duración, idioma, clasificación, director, reparto y país.

El segundo bloque estará destinado al contenido multimedia, permitiendo subir el poster, la imagen de fondo y agregar el enlace del trailer.

El tercer bloque permitirá seleccionar las categorías correspondientes.

El cuarto bloque estará dedicado al video y será el encargado de comunicarse con la API de Vimeus.

Finalmente existirá un bloque de publicación donde el administrador podrá decidir si la película permanece como borrador, se publica inmediatamente, se oculta del catálogo o aparece destacada en la página principal.

8. Integración con TMDb

Para acelerar el proceso de publicación, el formulario de creación de películas incorporará un botón denominado "Importar desde TMDb".

Al presionar este botón el administrador podrá escribir el nombre de una película y el sistema realizará una búsqueda utilizando la API de TMDb.

Una vez seleccionado el resultado correcto, el sistema completará automáticamente la mayor parte del formulario importando el título, título original, sinopsis, año, duración, géneros, director, reparto, imágenes oficiales y trailer.

Gracias a esta funcionalidad el administrador únicamente deberá verificar la información importada, subir el archivo de video a Vimeus y publicar la película, reduciendo considerablemente el tiempo necesario para incorporar nuevo contenido.

9. Integración con Vimeus

Toda la gestión de videos estará completamente centralizada mediante la API de Vimeus.

Cuando el administrador seleccione un archivo de video, el Backend enviará el contenido a Vimeus utilizando la API correspondiente. Durante este proceso el sistema mostrará el estado de la subida y posteriormente el progreso del procesamiento realizado por Vimeus.

Una vez finalizada la conversión, Vimeus devolverá un identificador único del video. Este identificador será almacenado en la base de datos y será utilizado posteriormente para reproducir la película dentro del sitio.

En ningún momento el archivo de video será almacenado en el servidor del proyecto. Toda la infraestructura relacionada con almacenamiento, procesamiento, conversión de formatos y distribución del streaming será responsabilidad de Vimeus.

10. Base de Datos

La base de datos estará diseñada pensando en la escalabilidad del proyecto.

Existirá una tabla de administradores donde se almacenarán las credenciales de acceso al panel.

La tabla principal será la de películas, donde se registrará toda la información descriptiva del catálogo, incluyendo los datos importados desde TMDb y el identificador del video generado por Vimeus.

Las categorías estarán almacenadas en una tabla independiente para permitir que una misma película pertenezca a múltiples géneros.

También existirán tablas destinadas a la configuración general del sitio, banners principales y registro del estado de procesamiento de cada video enviado a Vimeus.

La estructura deberá mantenerse completamente normalizada para facilitar futuras ampliaciones como usuarios, historial de reproducción, favoritos, listas personalizadas, suscripciones y recomendaciones.

11. Flujo del Administrador

El administrador accederá al panel mediante su usuario y contraseña.

Desde el Dashboard podrá dirigirse a la sección de películas y crear un nuevo registro.

Inicialmente podrá importar automáticamente la información desde TMDb o completar manualmente todos los datos si así lo desea.

Posteriormente cargará las imágenes necesarias y seleccionará el archivo de video.

El Backend enviará el video a Vimeus y comenzará el proceso de carga y conversión. Mientras tanto el sistema mostrará el estado correspondiente.

Cuando el procesamiento finalice, el Backend almacenará el identificador del video y habilitará la publicación de la película.

Una vez publicada, la película aparecerá automáticamente en el catálogo del sitio público respetando las categorías y configuraciones seleccionadas.

Todo el proceso deberá realizarse desde un único formulario y requerir la menor cantidad posible de pasos.

12. Flujo del Usuario

El visitante ingresará directamente al sitio sin necesidad de registrarse.

Podrá navegar por las diferentes categorías, utilizar el buscador o seleccionar cualquiera de las películas disponibles desde la página principal.

Al ingresar a la ficha de una película visualizará toda la información correspondiente y podrá comenzar la reproducción presionando el botón "Ver Ahora".

El Backend recuperará el identificador del video almacenado en la base de datos y solicitará a Vimeus el recurso necesario para iniciar el streaming.

El reproductor se cargará automáticamente dentro de la página ofreciendo una experiencia rápida, sencilla y sin pasos adicionales.

13. Seguridad

Toda la arquitectura deberá implementarse siguiendo buenas prácticas de seguridad.

Las credenciales de acceso a Vimeus y TMDb permanecerán exclusivamente en el Backend mediante variables de entorno.

El panel administrativo estará protegido mediante autenticación segura con contraseñas almacenadas utilizando algoritmos de hash.

El Backend será el único componente autorizado para comunicarse con APIs externas y acceder a la base de datos.

Se implementarán validaciones sobre los archivos enviados, limitaciones de tamaño, control de extensiones permitidas, protección frente a ataques de fuerza bruta y mecanismos de registro de errores para facilitar el mantenimiento.

14. Escalabilidad

Aunque la primera versión será deliberadamente sencilla, toda la arquitectura deberá prepararse para futuras expansiones.

Las próximas fases incorporarán registro de usuarios, inicio de sesión, perfiles personales, favoritos, historial de reproducción, recomendaciones inteligentes, listas personalizadas, comentarios, calificaciones, notificaciones, aplicaciones móviles, versión PWA, suscripciones Premium sin anuncios, integración con Mercado Pago y herramientas avanzadas de administración y estadísticas.

El objetivo es que todas estas funcionalidades puedan añadirse progresivamente aprovechando la misma base tecnológica, evitando refactorizaciones importantes y garantizando un crecimiento ordenado del producto.