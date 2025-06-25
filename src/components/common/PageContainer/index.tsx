interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
    return <div className="flex flex-col items-start py-8">{children}</div>;
};

export default PageContainer;
