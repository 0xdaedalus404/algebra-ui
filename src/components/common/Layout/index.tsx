import { Toaster } from '@/components/ui/toaster';
import Header from '../Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col w-full h-full">
            <Header />
            <div className='mt-12 p-2 bg-red-200 border border-2 font-bold border-red-700 text-red-500 rounded-lg'>💀 WARNING! This product is in the Beta stage. Use at your own risk & DYOR. 💀</div>
            <main className="h-full">{children}</main>
            <Toaster />
        </div>
    );
};

export default Layout;
