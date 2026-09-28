export const repo='https://github.com/betterwebinit/FrameworkBenchmarks';
export const upstream='https://www.techempower.com/benchmarks/';
export const sourceUrl=(path:string)=>`${repo}/tree/master/${path.split('/').map(encodeURIComponent).join('/')}`;
export const testTypes=[['json','JSON'],['db','Single query'],['query','Multiple queries'],['fortune','Fortunes'],['update','Updates'],['plaintext','Plaintext'],['cached-query','Cached queries']] as const;
export type CatalogRow={id:string;name:string;language:string;variants:number;databases:string[];tests:string[];path:string;configPath:string};
