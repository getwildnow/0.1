import Link from 'next/link'

export function Footer() {
  return (
    <footer
      className="relative w-full min-h-[381px] flex flex-col items-center px-5 md:px-[20px] py-8 md:py-[30px]"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(27, 29, 26, 1) 0%, rgba(27, 29, 26, 1) 100%), linear-gradient(90deg, rgba(36, 49, 50, 1) 0%, rgba(36, 49, 50, 1) 100%)',
      }}
    >
      <div className="w-full max-w-[1600px] flex flex-col gap-[10px]">
        <div className="flex flex-col md:flex-row items-start justify-between w-full gap-8 md:gap-0">
          {/* Left Column */}
          <div className="flex flex-col gap-[20px] flex-1">
            {/* Support */}
            <div className="flex flex-col gap-[10px] text-[#f8d794] text-[14px] font-normal tracking-[-0.42px] leading-[0.9]">
              <p>Support</p>
              <p>+1 (415) 866-6729 / support@getwild-now.com</p>
            </div>
            {/* Sponsorship */}
            <div className="flex flex-col gap-[10px] text-[#f8d794] text-[14px] font-normal tracking-[-0.42px] leading-[0.9]">
              <p>Sponsorship</p>
              <a href="mailto:sponsorships@getwild-now.com" className="underline hover:text-[#fffaf4] transition-colors">
                sponsorships@getwild-now.com
              </a>
            </div>
            {/* Legal */}
            <div className="flex flex-col gap-[6px] text-[#f8d794] text-[14px] font-normal tracking-[-0.42px] leading-[0.9]">
              <div className="flex gap-x-6">
                <Link href="/terms-of-service" className="text-[#f8d794] hover:text-[#fffaf4] transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy-policy" className="text-[#f8d794] hover:text-[#fffaf4] transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <p>© {new Date().getFullYear()} Get Wild. All rights reserved.</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[20px] flex-1">
            {/* Socials */}
            <div className="relative h-[47px]">
              <p className="absolute top-[6.5px] left-0 text-[#f8d794] text-[14px] font-normal tracking-[-0.42px] leading-[0.9]">
                Socials
              </p>
              <div className="absolute left-0 top-[23px] h-[24px] flex gap-2">
                <a href="https://www.youtube.com/@getwildnow" target="_blank" rel="noopener noreferrer" className="bg-[#f8d794] rounded-full w-[24px] h-[24px] hover:opacity-80 transition-opacity" aria-label="YouTube" />
                <a href="https://www.tiktok.com/@getwildfr" target="_blank" rel="noopener noreferrer" className="bg-[#f8d794] rounded-full w-[24px] h-[24px] hover:opacity-80 transition-opacity" aria-label="TikTok" />
                <a href="https://www.linkedin.com/in/konstantinsaifoulline/" target="_blank" rel="noopener noreferrer" className="bg-[#f8d794] rounded-full w-[24px] h-[24px] hover:opacity-80 transition-opacity" aria-label="LinkedIn" />
                <a href="https://luma.com/getwild?k=c" target="_blank" rel="noopener noreferrer" className="bg-[#f8d794] rounded-full w-[24px] h-[24px] hover:opacity-80 transition-opacity" aria-label="Events" />
              </div>
            </div>
            {/* Why we do it */}
            <div className="flex flex-col gap-[10px] text-[#f8d794] text-[14px] font-normal tracking-[-0.42px] leading-[0.9] max-w-[367px]">
              <p>Why we do it:</p>
              <p>
                Our mission is to improve suburban quality of life by reducing car dependency and promoting active transportation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Large Tagline */}
      <div className="absolute left-1/2 top-[261.5px] -translate-x-1/2 -translate-y-1/2 w-full max-w-[1260px] px-4">
        <h3 className="text-[60px] md:text-[80px] lg:text-[131.5px] font-normal text-[#f8d794] text-center tracking-[-3.945px] leading-[0.9]">
          <span>Get </span>
          <span className="text-[#f8d794]">狂野</span>. Be free.
        </h3>
      </div>
    </footer>
  )
}
