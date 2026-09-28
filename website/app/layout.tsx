import type {Metadata} from 'next';
import './globals.css';
import './workspace.css';
import './better-web.css';
import './density.css';
import './technology-icons.css';
export const metadata:Metadata={metadataBase:new URL('https://frameworkbenchmarks.better-web.org'),title:'framework benchmarks — Choose with context.',description:'Explore 21 published TechEmpower benchmark rounds, compare throughput, latency, workloads and web framework stacks. A Better Web community portal.',icons:{icon:'/favicon.png'},openGraph:{title:'framework benchmarks — Choose with context.',description:'Explore. Compare. Measure.',type:'website',images:[{url:'/og.png',width:1536,height:1024,alt:'framework benchmarks — Choose your stack with context.'}]},twitter:{images:['/og.png'],card:'summary_large_image',title:'framework benchmarks — Choose with context.'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark"><body>{children}</body></html>;}
