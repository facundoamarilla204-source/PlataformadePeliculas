import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Derechos de Autor (DMCA) | CINARIS',
  description: 'Política de Derechos de Autor (DMCA) de CINARIS.',
};

export default function DMCAPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-[#0b0f19] rounded-2xl p-8 md:p-12 border border-white/5">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Política de Derechos de Autor (DMCA)</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-neutral-300">
          <p className="text-sm text-neutral-400">Última actualización: 23 de julio de 2026</p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Aviso para titulares de derechos de autor</h2>
          <p>
            En CINARIS respetamos los derechos de propiedad intelectual y estamos comprometidos con atender de forma rápida y responsable cualquier reclamación relacionada con contenido protegido por derechos de autor.
          </p>
          <p>
            Si usted es el titular de los derechos exclusivos de una obra o actúa en representación del titular y considera que algún contenido accesible desde CINARIS infringe sus derechos, puede enviarnos una notificación para que revisemos el caso y, cuando corresponda, retiremos el acceso al contenido o a los enlaces relacionados.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Cómo presentar una solicitud</h2>
          <p>
            Para procesar su solicitud de la manera más rápida posible, envíe un correo electrónico a <strong>copyright@cinaris.com</strong> con la siguiente información:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre completo del titular de los derechos o de su representante autorizado.</li>
            <li>Información de contacto válida (correo electrónico y, opcionalmente, teléfono).</li>
            <li>Documentación que demuestre la titularidad de los derechos o la autorización para actuar en nombre del titular.</li>
            <li>Identificación de la obra protegida cuyos derechos considera infringidos.</li>
            <li>Enlace(s) directo(s) dentro de CINARIS donde se encuentra el contenido objeto de la reclamación.</li>
            <li>Una declaración indicando que considera de buena fe que el uso del material no ha sido autorizado por el titular de los derechos, su representante o la legislación aplicable.</li>
            <li>Una declaración de que toda la información proporcionada es veraz y que está autorizado para presentar la reclamación.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Proceso de revisión</h2>
          <p>
            Una vez recibida la notificación, nuestro equipo revisará la solicitud y podrá requerir información adicional para verificar la reclamación.
          </p>
          <p>
            Si la solicitud resulta válida, CINARIS eliminará o deshabilitará el acceso al contenido o a los enlaces correspondientes en un plazo razonable.
          </p>
          <p>
            Nuestro objetivo es responder a todas las solicitudes en un plazo máximo de 7 días hábiles, aunque en la mayoría de los casos el proceso se realiza en un tiempo considerablemente menor.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Declaración sobre el contenido</h2>
          <p>
            CINARIS no aloja ni almacena archivos de video protegidos por derechos de autor en sus propios servidores.
          </p>
          <p>
            El contenido disponible en la plataforma proviene de fuentes públicas y servicios de terceros, siendo mostrado mediante enlaces o reproductores embebidos disponibles públicamente en Internet.
          </p>
          <p>
            CINARIS no produce, distribuye ni realiza copias de las obras audiovisuales mostradas en la plataforma y no reclama ningún derecho de propiedad sobre dicho contenido.
          </p>
          <p>
            Si un titular de derechos considera que algún contenido disponible a través de nuestra plataforma infringe sus derechos, puede notificárnoslo siguiendo el procedimiento descrito en esta política. Revisaremos cada solicitud y eliminaremos el acceso al contenido o a los enlaces correspondientes cuando sea necesario.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Reclamaciones reiteradas</h2>
          <p>
            CINARIS se reserva el derecho de restringir o eliminar el acceso a cualquier contenido que sea objeto de reclamaciones válidas reiteradas o que pueda infringir derechos de propiedad intelectual.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contacto</h2>
          <p>
            Para cualquier consulta relacionada con derechos de autor o solicitudes DMCA, puede comunicarse con nosotros en:
          </p>
          <p>
            <strong>Correo electrónico:</strong> copyright@cinaris.com
          </p>
        </div>
      </div>
    </div>
  );
}
