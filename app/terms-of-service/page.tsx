'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>
            By accessing this website, you are agreeing to be bound by these terms of service, all
            applicable laws and regulations, and agree that you are responsible for compliance with
            any applicable local laws.
          </p>
          <p>
            Permission is granted to temporarily download one copy of the materials (information
            or software) on this website for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this license you
            may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose, or for any public display
              (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on this website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the materials; or
            </li>
            <li>
              transfer the materials to another person or "mirror" the materials on any other
              server.
            </li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions
            and may be terminated by us at any time. Upon terminating your viewing of these
            materials or upon the termination of this license, you must destroy any downloaded
            materials in your possession whether in electronic or printed format.
          </p>
          <p>
            The materials on this website are provided on an 'as is' basis. We make no
            warranties, expressed or implied, and hereby disclaim and negate all other
            warranties including, without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
          <p>
            In no event shall we or our suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on this website, even if we
            or an authorized representative has been notified orally or in writing of the
            possibility of such damage.
          </p>
          <p>
            The materials appearing on this website could include technical, typographical, or
            photographic errors. We do not warrant that any of the materials on its website are
            accurate, complete or current. We may make changes to the materials contained on this
            website at any time without notice. However we do not make any commitment to update
            the materials.
          </p>
          <p>
            We have not reviewed all of the sites linked to this website and are not responsible
            for the contents of any such linked site. The inclusion of any link does not imply
            endorsement by us of the site. Use of any such linked website is at the user's own
            risk.
          </p>
          <p>
            We may revise these terms of service for this website at any time without notice. By
            using this website you are agreeing to be bound by the then current version of these
            terms of service.
          </p>
          <p>
            Any claim relating to this website shall be governed by the laws of the our
            operating country without regard to its conflict of law provisions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
