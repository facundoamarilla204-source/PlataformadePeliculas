import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos de Servicio | CINARIS',
  description: 'Términos de Servicio de CINARIS.',
};

export default function TerminosPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-[#0b0f19] rounded-2xl p-8 md:p-12 border border-white/5">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Términos de Servicio</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-neutral-300">
          <p className="text-sm text-neutral-400">Última actualización: 23 de julio de 2026</p>

          <p>Bienvenido a CINARIS. Al acceder y utilizar nuestro sitio web y servicios, aceptas cumplir con los siguientes Términos de Servicio. Te recomendamos leerlos cuidadosamente.</p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Reglas de uso de CINARIS</h2>
          <p>
            El acceso a nuestra plataforma está destinado a un uso personal y no comercial. Te comprometes a utilizar el servicio de manera legal, ética y conforme a estos términos. Queda estrictamente prohibido utilizar la plataforma para distribuir malware, recopilar datos masivos de manera automatizada (scraping) o cualquier acción que comprometa la integridad del sitio.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Responsabilidades del usuario</h2>
          <p>
            Como usuario, eres responsable de todas las actividades que ocurran bajo tu cuenta. Debes proporcionar información precisa y mantener la confidencialidad de tus credenciales de acceso. CINARIS no se responsabiliza por cualquier pérdida o daño derivado de tu incumplimiento para salvaguardar tu cuenta.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Propiedad intelectual</h2>
          <p>
            Todos los logotipos, marcas comerciales, código y diseños que forman parte de la interfaz de CINARIS son propiedad exclusiva nuestra. Sin embargo, respetamos los derechos de terceros. CINARIS funciona como un indexador de contenido; el material audiovisual mostrado proviene de servidores externos.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Cuentas y suscripciones</h2>
          <p>
            La creación de una cuenta en CINARIS te otorga acceso a funcionalidades personalizadas. En caso de ofrecer servicios premium, las tarifas, métodos de facturación y políticas de renovación se detallarán en el momento de la compra. Te reservamos el derecho a modificar las tarifas con previo aviso.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Limitación de responsabilidad</h2>
          <p>
            CINARIS se ofrece "tal cual" y "según disponibilidad". No garantizamos que el servicio será ininterrumpido o libre de errores. En la máxima medida permitida por la ley, no nos hacemos responsables por daños directos, indirectos, incidentales o consecuentes derivados del uso de nuestra plataforma.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Suspensión de cuentas</h2>
          <p>
            Nos reservamos el derecho de suspender o cancelar tu cuenta de manera permanente y sin previo aviso si se detecta un incumplimiento grave de estos Términos de Servicio, incluyendo fraude, suplantación de identidad, o cualquier uso ilícito de la plataforma.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Ley aplicable</h2>
          <p>
            Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes aplicables de la jurisdicción local, sin dar efecto a ningún principio de conflictos de leyes. Cualquier disputa que surja en relación con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales correspondientes.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Derechos de Autor (DMCA)</h2>
          <p>
            CINARIS respeta los derechos de propiedad intelectual. Si considera que algún contenido infringe sus derechos de autor, consulte nuestra <Link href="/dmca" className="text-primary hover:underline">Política de Derechos de Autor (DMCA)</Link> para conocer el procedimiento de notificación y eliminación de contenido.
          </p>

        </div>
      </div>
    </div>
  );
}
