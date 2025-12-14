import { DashboardLayout } from '@/components/DashboardLayout';
import { ContentArea } from '@/components/ContentArea';
import { Code, Palette, Coffee, Bike, Film, Gamepad2, Music, Camera } from 'lucide-react';

const interests = [
    { name: 'Coding', icon: Code, color: 'from-purple-500 to-blue-500' },
    { name: 'Design', icon: Palette, color: 'from-pink-500 to-purple-500' },
    { name: 'Coffee', icon: Coffee, color: 'from-amber-500 to-orange-500' },
    { name: 'Bike Tours', icon: Bike, color: 'from-green-500 to-emerald-500' },
    { name: 'Movies', icon: Film, color: 'from-red-500 to-pink-500' },
    { name: 'Gaming', icon: Gamepad2, color: 'from-indigo-500 to-purple-500' },
    { name: 'Music', icon: Music, color: 'from-purple-500 to-pink-500' },
    { name: 'Photography', icon: Camera, color: 'from-cyan-500 to-blue-500' },
];

export default function InterestsPage() {
    return (
        <DashboardLayout>
            <ContentArea
                title="Interests"
                description="Things I'm passionate about beyond coding"
            >
                <div className="space-y-8">
                    {/* Interests Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {interests.map((interest) => {
                            const Icon = interest.icon;
                            return (
                                <div
                                    key={interest.name}
                                    className="group relative bg-purple-900/10 border border-purple-500/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(137,42,220,0.3)] hover:scale-105"
                                >
                                    {/* Icon with gradient background */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${interest.color} p-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-full h-full text-white" />
                                    </div>

                                    {/* Interest Name */}
                                    <h3 className="text-white font-semibold text-center">
                                        {interest.name}
                                    </h3>

                                    {/* Glow effect on hover */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${interest.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Description Section */}
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                            About My Interests
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-6 space-y-3">
                                <h3 className="text-lg font-semibold text-purple-300">Creative Pursuits</h3>
                                <p className="text-purple-100/70 leading-relaxed">
                                    I love exploring the intersection of technology and creativity. Whether it's designing
                                    beautiful user interfaces, capturing moments through photography, or creating digital art,
                                    I find joy in bringing ideas to life.
                                </p>
                            </div>
                            <div className="bg-purple-900/10 border border-purple-500/30 rounded-2xl p-6 space-y-3">
                                <h3 className="text-lg font-semibold text-purple-300">Adventure & Exploration</h3>
                                <p className="text-purple-100/70 leading-relaxed">
                                    When I'm not coding, you'll find me on bike tours exploring new places, watching thought-provoking
                                    films, or enjoying a good cup of coffee while brainstorming new project ideas.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </ContentArea>
        </DashboardLayout>
    );
}
