'use client'

import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useState } from 'react'

// Figma image assets
const imgRectangle29 = 'https://www.figma.com/api/mcp/asset/3fe573f9-ece1-4c9c-9a86-d5430d7a55f0'
const img7A6A9C206A653720A5F5F364817Bbfe31 = 'https://www.figma.com/api/mcp/asset/e9b63102-d763-4b46-b245-89c2d2017d2b'
const img7B152C5210C52F0608A58C312B8C86Aa1 = 'https://www.figma.com/api/mcp/asset/a28c3600-e64f-490e-964f-bcafe224226f'
const imgRectangle31 = 'https://www.figma.com/api/mcp/asset/1a8dcf3f-77d9-48cc-aa43-8bae41290e32'
const imgRectangle38 = 'https://www.figma.com/api/mcp/asset/695ca869-e2d0-40fe-8dcd-96beafc3bbbc'
const imgRectangle56 = 'https://www.figma.com/api/mcp/asset/33b3021d-d1a0-443a-9369-2e632b9d9e4c'
const imgUberschriftHinzufugen51 = 'https://www.figma.com/api/mcp/asset/d48a758e-4fa3-4e2b-b1bd-1e0831d916b9'

const faqItems = [
  {
    question: 'One Product: Full Coverage of Everything',
    answer:
      "We believe health insurance should be simple. We offer one plan that covers everything related to your body and health that hurts you (except fraud), including dental and vision. There are no co-payments or deductibles. The only thing personalized is your premium, because that's the fairest way to provide the best experience.",
  },
  {
    question: 'Claims payed in under 59 minutes',
    answer:
      "The industry average for processing a claim is 14 days. We think that's unacceptable. We process every claim in under 59 minutes and pay hospitals directly or give you the cash upfront. It’s your money; you shouldn't have to wait.",
  },
  {
    question: '24/7 human support in under 30 seconds',
    answer:
      "We hate waiting for help from call centers. You'll reach a real, highly-skilled human on our team in under 30 seconds, 24/7. We aim to solve every issue in under 3 minutes because you deserve fast, effective support.",
  },
  {
    question: 'What is not included in our plan?',
    answer:
      "To keep premiums fair for everyone, we don't cover elective cosmetic surgery, extra wellness treatments, or predictable subscriptions like gym memberships. Our goal is to protect you from unpredictable health events. Including these extras would add high costs for the whole community, forcing people who don't use them to pay more.",
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <Navigation />
      <main className="relative bg-white">
        {/* Hero Section */}
        <section id="overview" className="relative bg-[#fffaf4] h-[741px] pt-[83px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-[48px] font-semibold text-[#0e1414] text-center tracking-[-1.44px] leading-none mb-4">
              POV: your Team gets everything covered.
            </h1>
            <p className="text-[20px] font-normal text-[#0e1414] text-center tracking-[-0.6px] leading-[0.9]">
              Including wearables and biometric labs.
            </p>
          </div>
        </section>

        {/* Wearables Section */}
        <section id="benefits" className="scroll-mt-[83px] relative h-[604px] bg-[#1b1d1a] -mt-16 z-10">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#1b1d1a] opacity-[0.49]">
              <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" src={imgRectangle29} />
            </div>
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-[60px]">
            <div className="backdrop-blur-[17.5px] bg-[rgba(217,217,217,0.1)] rounded-[13px] shadow-[0px_4px_21.3px_0px_rgba(0,0,0,0.11)] w-full max-w-[1159px] h-[657px] p-8">
              <h2 className="text-[48px] font-semibold text-[#fffaf4] text-left mb-6 tracking-[-1.44px] leading-none">
                Free wearables of your choice
              </h2>
              <p className="text-[20px] font-normal text-[#fffaf4] mb-8 tracking-[-0.6px] leading-[1.2] max-w-[600px] text-left">
                Choose between an Oura Ring or Whoop band. <br />
                Track your sleep, recovery, and activity 24/7. We'll ship it to you for free and help you get started.
              </p>
              <div className="flex gap-6 justify-center">
                <div className="relative w-[311px] h-[389px] rounded-[5px] overflow-hidden">
                  <img alt="Oura Ring" className="absolute inset-0 w-full h-full object-cover rounded-[5px]" src={img7A6A9C206A653720A5F5F364817Bbfe31} />
                </div>
                <div className="relative w-[519px] h-[389px] rounded-[5px] overflow-hidden">
                  <img alt="Whoop band" className="absolute inset-0 w-full h-full object-cover rounded-[5px]" src={img7B152C5210C52F0608A58C312B8C86Aa1} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Health Insights Section */}
        <section className="relative bg-[#1b1d1a] py-28 -mt-16">
          <div className="absolute inset-0">
              <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" src={imgRectangle29} />
          </div>
          <div className="relative w-full max-w-4xl mx-auto px-8 text-center mt-12">
            <h2 className="text-4xl sm:text-5xl font-semibold text-brand-cream tracking-tight">
              AI-powered health insights
            </h2>
            <p className="mt-4 text-lg text-brand-gray">
              Chat with an AI doctor
            </p>
            
            <div className="mt-12 backdrop-blur-xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <div className="space-y-6">
                {/* User Message */}
                <div className="flex flex-col items-end">
                  <div className="bg-brand-yellow rounded-2xl rounded-br-none max-w-md p-4">
                    <p className="text-base text-brand-black text-left">
                      I have broken my leg what should I do now?
                    </p>
                  </div>
                  <span className="text-xs text-brand-gray mt-2">10:31 AM</span>
                </div>

                {/* AI Message */}
                <div className="flex flex-col items-start">
                  <div className="bg-brand-teal rounded-2xl rounded-bl-none max-w-md p-4">
                    <p className="text-base text-brand-cream text-left">
                      Go to this nearby hospital to let it check: <span className="font-semibold text-brand-yellow/80">1001 Potrero Ave, San Francisco CA 94110.</span> We will pay the claim for it instantly. Let me know if I can do something else for you right now.
                    </p>
                  </div>
                   <span className="text-xs text-brand-gray mt-2">10:32 AM</span>
                </div>

                {/* User Message */}
                <div className="flex flex-col items-end">
                  <div className="bg-brand-yellow rounded-2xl rounded-br-none max-w-md p-4">
                    <p className="text-base text-brand-black text-left">
                      Thank you!
                    </p>
                  </div>
                   <span className="text-xs text-brand-gray mt-2">10:32 AM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Healthier People Section */}
        <section id="product" className="scroll-mt-[83px] relative bg-[#fffaf4] py-20">
          <div className="max-w-[1200px] mx-auto px-8">
            <h2 className="text-[64px] font-semibold text-[#3c3c3c] text-center mb-6 tracking-[-1.92px] leading-none">
              Healthier people.
              <br />
              Better teams.
            </h2>
            <p className="text-[24px] font-semibold text-[#797979] text-center mb-16 tracking-[-0.72px] leading-none">
              Focus on building. We take care of your people's health.
            </p>

            {/* Dashboard Preview */}
            <div className="bg-[#333333] border border-[#1b1d1a] rounded-[45px] w-full overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)]">
              {/* Browser Bar */}
              <div className="bg-[#333333] border border-[#1b1d1a] rounded-tl-[45px] rounded-tr-[45px] h-[48px] flex items-center pl-8 pr-20 gap-2">
                <div className="flex gap-2">
                  <div className="bg-[#ff6467] rounded-full w-[20px] h-[20px]" />
                  <div className="bg-[#fec700] rounded-full w-[20px] h-[20px]" />
                  <div className="bg-[#00df73] rounded-full w-[20px] h-[20px]" />
                </div>
                <div className="bg-[#fffaf4] border border-[#1b1d1a] rounded-[8px] h-[29px] flex-1 flex items-center px-4 ml-4">
                  <img alt="" className="w-[28px] h-[28px] mr-2" src={imgUberschriftHinzufugen51} />
                  <span className="text-[15px] font-medium text-[#333333]">getwild-now.com/dashboard</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="bg-[#243132] border border-[#1b1d1a] p-8">
                <h3 className="text-[48px] font-semibold text-[#fffaf4] text-center mb-8 tracking-[-1.44px] leading-none">
                  Good Morning Martin
                </h3>
                <div className="bg-[#243132] border border-[#1b1d1a] rounded-[45px] overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-[#243132] border-b border-[#1b1d1a] px-6 py-4 flex items-center">
                    <div className="w-[30px] mr-6">
                      <p className="text-[16px] font-semibold text-[#fffaf4] tracking-[-0.08px] leading-[1.45]">Edit</p>
                    </div>
                    <p className="text-[16px] font-normal text-[#fffaf4] tracking-[-0.48px] leading-none flex-1">Team Members</p>
                    <p className="text-[16px] font-normal text-[#fffaf4] tracking-[-0.48px] leading-none w-[200px]">Role</p>
                    <p className="text-[16px] font-normal text-[#fffaf4] tracking-[-0.48px] leading-none w-[150px] text-right">Fitness Level</p>
                  </div>

                  {/* Table Rows */}
                  <div className="bg-[#fffaf4] rounded-b-[45px]">
                    {/* Row 1 - Highlighted */}
                    <div className="bg-[#f8d794] border-b border-[#243132] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="bg-[#333333] rounded-[5px] w-[30px] h-[30px] flex items-center justify-center">
                          <img alt="" className="w-[20px] h-[20px]" src={imgRectangle56} />
                        </div>
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">Martin Fischer</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">Creative Director</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">87%</p>
                    </div>

                    {/* Row 2 - Highlighted */}
                    <div className="bg-[#f8d794] border-b border-[#243132] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="bg-[#333333] rounded-[4px] w-[30px] h-[30px] flex items-center justify-center">
                          <img alt="" className="w-[20px] h-[20px]" src={imgRectangle56} />
                        </div>
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">Luise Storberg</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">Software Engineer</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">93%</p>
                    </div>

                    {/* Row 3 */}
                    <div className="bg-[#fffaf4] border-b border-[#243132] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="border border-[#243132] rounded-[4px] w-[30px] h-[30px]" />
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">Kristian Well</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">Software Engineer</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">67%</p>
                    </div>

                    {/* Row 4 */}
                    <div className="bg-[#fffaf4] border-b border-[#243132] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="border border-[#243132] rounded-[5px] w-[30px] h-[30px]" />
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">Mark Gebauer</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">General Sales</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">80%</p>
                    </div>

                    {/* Row 5 */}
                    <div className="bg-[#fffaf4] border-b border-[#243132] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="border border-[#243132] rounded-[4px] w-[30px] h-[30px]" />
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">Sarah Chen</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">Product Manager</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">91%</p>
                    </div>

                    {/* Row 6 */}
                    <div className="bg-[#fffaf4] border-b border-[#243132] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="border border-[#243132] rounded-[4px] w-[30px] h-[30px]" />
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">James Rodriguez</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">UX Designer</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">88%</p>
                    </div>

                    {/* Row 7 */}
                    <div className="bg-[#fffaf4] px-6 py-4 flex items-center">
                      <div className="w-[30px] mr-6">
                        <div className="border border-[#243132] rounded-[4px] w-[30px] h-[30px]" />
                      </div>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none flex-1">Emily Watson</p>
                      <p className="text-[17px] font-medium text-[#333333] tracking-[-0.51px] leading-none w-[200px]">Marketing Lead</p>
                      <p className="text-[17px] font-bold text-[#333333] tracking-[-0.51px] leading-none w-[150px] text-right">75%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="scroll-mt-[83px] relative bg-[#fffaf4] pt-8 pb-20">
          <div className="max-w-[1200px] mx-auto px-8">
            <h2 className="text-[64px] font-semibold text-[#1b1d1a] text-center mb-16 tracking-[-1.92px] leading-none">
              Premium benefits.
              <br />
              Simple pricing for your business.
            </h2>
            <div className="flex justify-center">
              <div className="w-[816px] h-[436px] bg-[#333333] border border-[#1b1d1a] rounded-[15px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)] p-12 relative">
                <div className="absolute top-6 right-6">
                  <div className="bg-[#989795] rounded-[10px] w-[148px] h-[27px] flex items-center justify-center shadow-[inset_0px_4px_7.1px_0px_rgba(0,0,0,0.21)]">
                    <span className="text-[15px] font-normal text-[#333333] tracking-[-0.45px]">California</span>
                  </div>
                </div>
                <h3 className="text-[40px] font-semibold text-[#fffaf4] text-center mb-2 tracking-[-1.2px] leading-none">
                  Business Health Insurance
                </h3>
                <p className="text-[20px] font-normal text-[#fffaf4] text-center mb-8 tracking-[-0.6px] leading-none">
                  For teams with 20+ employees
                </p>
                <div className="text-center mb-4">
                  <div className="flex items-end justify-center">
                    <span className="text-[128px] font-semibold text-[#fffaf4] tracking-[-3.84px] leading-none">$750</span>
                    <span className="text-[14px] font-normal text-[#fffaf4] ml-4 tracking-[-0.42px] leading-none mb-2">per member/mo</span>
                  </div>
                </div>
                <div className="mt-12 flex justify-center">
                  <button className="bg-[#fffaf4] border-2 border-[#7b7b7b] rounded-[31px] w-[280px] h-[50px] flex items-center justify-center">
                    <span className="text-[24px] font-semibold text-[#333333] tracking-[-0.72px] leading-none">Book a demo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-[83px] relative bg-[#fffaf4] py-20">
          <div className="max-w-[1200px] mx-auto px-8">
            <h2 className="text-[64px] font-semibold text-[#1b1d1a] text-center mb-16 tracking-[-1.92px] leading-none">
              FAQ
            </h2>
            <div className="space-y-4 max-w-[904px] mx-auto">
              {faqItems.map((item, index) => (
                <div key={item.question} className="border border-[#1b1d1a]/20 rounded-[10px] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full bg-transparent p-6 flex items-center justify-between transition-colors"
                  >
                    <span className="text-[20px] font-medium text-[#333333] tracking-[-0.6px] text-left">{item.question}</span>
                    <svg
                      className={`w-5 h-5 text-[#333333] transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openFaq === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 pt-2 text-left text-gray-700 border-t border-[#1b1d1a]/20">
                      <p className="text-base leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
