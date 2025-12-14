import { Card } from "./Card";

export const ExtraCard = () => {
    return (
        <Card className="bg-[#0a0514] border-2 border-purple-600/50 flex flex-col items-center justify-center h-full w-full p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-400 mb-2">Coming Soon</h3>
                <p className="text-purple-300/70">More exciting content will be added here</p>
            </div>
        </Card>
    );
};
