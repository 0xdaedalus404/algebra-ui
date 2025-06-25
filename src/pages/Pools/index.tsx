import PageContainer from "@/components/common/PageContainer";
import PageTitle from "@/components/common/PageTitle";
import PoolsList from "@/components/pools/PoolsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const PoolsPage = () => {
    return (
        <PageContainer>
            <div className="w-full grid grid-cols-4 gap-3 mb-3 mt-16 justify-between">
                <div className="col-span-3">
                    <PageTitle title={"Pools"} showSettings={false} />
                </div>
                <Link className="col-span-1 w-full" to={"create"}>
                    <Button
                        className="whitespace-nowrap h-16 w-full gap-3 rounded-xl text-lg! hover:bg-primary-300 bg-primary-300 text-black"
                        size={"md"}
                    >
                        Create a Pool
                        <div className="rounded-full p-1 bg-black">
                            <Plus size={20} className="text-text-100" />
                        </div>
                    </Button>
                </Link>
            </div>

            <div className="w-full">
                <div className="pb-5 bg-card border border-card-border/60 rounded-xl">
                    <PoolsList />
                </div>
            </div>
        </PageContainer>
    );
};

export default PoolsPage;
