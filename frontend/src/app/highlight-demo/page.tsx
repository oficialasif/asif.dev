'use client';

import { Highlight, Underline, Notice, Badge, Circle, MarkerLine } from '@/components/highlight';

export default function HighlightDemoPage() {
    return (
        <div className="min-h-screen bg-[color:var(--color-background)] p-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-white">
                        Text <Highlight color="purple" variant="gradient" animated="draw">Highlighting</Highlight> System
                    </h1>
                    <p className="text-gray-400">
                        Beautiful text decorations and emphasis components
                    </p>
                </div>

                {/* Highlight Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Highlight Component
                    </h2>

                    <div className="space-y-4 text-gray-300">
                        <p>
                            This is a <Highlight color="yellow">yellow marker highlight</Highlight> with default settings.
                        </p>

                        <p>
                            This is a <Highlight color="green" intensity="strong">strong green highlight</Highlight> for emphasis.
                        </p>

                        <p>
                            This is a <Highlight color="pink" animated="draw">animated pink highlight</Highlight> with drawing effect.
                        </p>

                        <p>
                            This is a <Highlight color="blue" variant="gradient" animated="pulse">gradient blue highlight</Highlight> with pulse animation.
                        </p>

                        <p>
                            This is a <Highlight color="purple" animated="glow">purple highlight with glow</Highlight> effect.
                        </p>

                        <p>
                            This is a <Highlight color="orange" intensity="light">light orange highlight</Highlight> for subtle emphasis.
                        </p>
                    </div>
                </section>

                {/* Underline Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Underline Component
                    </h2>

                    <div className="space-y-4 text-gray-300 text-lg">
                        <p>
                            This is a <Underline type="straight" color="primary">straight underline</Underline> in primary color.
                        </p>

                        <p>
                            This is a <Underline type="wavy" color="accent">wavy underline</Underline> in accent color.
                        </p>

                        <p>
                            This is a <Underline type="dashed" color="success">dashed underline</Underline> in success color.
                        </p>

                        <p>
                            This is a <Underline type="dotted" color="warning" thickness="thick">thick dotted underline</Underline> in warning color.
                        </p>

                        <p>
                            This is a <Underline type="gradient" animated="draw">gradient underline with draw animation</Underline>.
                        </p>

                        <p>
                            This is a <Underline type="wavy" animated="wave" color="accent">wavy animated underline</Underline>.
                        </p>

                        <p>
                            This is a <Underline type="double" color="error" thickness="medium">double underline</Underline> in error color.
                        </p>
                    </div>
                </section>

                {/* Notice Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Notice Component
                    </h2>

                    <Notice type="info" title="Information">
                        This is an informational notice box. Use this for helpful tips and general information.
                    </Notice>

                    <Notice type="success" title="Success!">
                        Your changes have been saved successfully. Everything is working as expected.
                    </Notice>

                    <Notice type="warning" title="Warning">
                        Please review your input before proceeding. This action may have consequences.
                    </Notice>

                    <Notice type="error" title="Error">
                        An error occurred while processing your request. Please try again later.
                    </Notice>

                    <Notice type="custom" title="Custom Notice" icon={true}>
                        This is a custom styled notice box with default purple theme.
                    </Notice>

                    <Notice type="info" icon={false}>
                        This notice doesn't have an icon, just plain text content.
                    </Notice>
                </section>

                {/* Badge Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Badge Component
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-white font-semibold mb-3">Filled Badges</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="filled" color="primary">Primary</Badge>
                                <Badge variant="filled" color="accent">Accent</Badge>
                                <Badge variant="filled" color="success">Success</Badge>
                                <Badge variant="filled" color="warning">Warning</Badge>
                                <Badge variant="filled" color="error">Error</Badge>
                                <Badge variant="filled" color="info">Info</Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-3">Outlined Badges</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outlined" color="primary">Primary</Badge>
                                <Badge variant="outlined" color="accent">Accent</Badge>
                                <Badge variant="outlined" color="success">Success</Badge>
                                <Badge variant="outlined" color="warning">Warning</Badge>
                                <Badge variant="outlined" color="error">Error</Badge>
                                <Badge variant="outlined" color="info">Info</Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-3">Subtle Badges</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="subtle" color="primary">Primary</Badge>
                                <Badge variant="subtle" color="accent">Accent</Badge>
                                <Badge variant="subtle" color="success">Success</Badge>
                                <Badge variant="subtle" color="warning">Warning</Badge>
                                <Badge variant="subtle" color="error">Error</Badge>
                                <Badge variant="subtle" color="info">Info</Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-3">Sizes</h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge size="sm">Small</Badge>
                                <Badge size="md">Medium</Badge>
                                <Badge size="lg">Large</Badge>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Circle Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Circle Component
                    </h2>

                    <div className="space-y-6 text-gray-300 text-lg">
                        <p>
                            Circle around text for <Circle color="red" animated="draw">emphasis</Circle> with red marker.
                        </p>

                        <p>
                            This is a <Circle color="blue" style="smooth">smooth blue circle</Circle> around text.
                        </p>

                        <p>
                            Create <Circle color="green" style="dashed" thickness={4}>dashed green circle</Circle> effects.
                        </p>

                        <p>
                            Use <Circle color="yellow" animated="pulse" padding={12}>animated yellow circle</Circle> with pulse effect.
                        </p>

                        <p>
                            Or make a <Circle color="purple" animated="bounce" style="rough">bouncing purple circle</Circle>!
                        </p>

                        <div className="flex flex-wrap gap-6 items-center">
                            <Circle color="orange" animated="draw" thickness={5}>
                                <span className="text-2xl font-bold">IMPORTANT</span>
                            </Circle>

                            <Circle color="red" style="smooth" padding={16}>
                                <span className="text-xl">Sale!</span>
                            </Circle>

                            <Circle color="blue" animated="pulse">
                                <Badge variant="filled" color="info">NEW</Badge>
                            </Circle>
                        </div>
                    </div>
                </section>

                {/* MarkerLine Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        MarkerLine Component
                    </h2>

                    <div className="space-y-6 text-gray-300 text-2xl">
                        <p>
                            This is <MarkerLine color="red" animated="draw">underlined with red marker</MarkerLine> effect.
                        </p>

                        <p>
                            Create <MarkerLine color="blue" thickness={6}>thick blue marker line</MarkerLine> for emphasis.
                        </p>

                        <p>
                            Use <MarkerLine color="yellow" animated="pulse">animated yellow marker</MarkerLine> for highlighting.
                        </p>

                        <p>
                            Or add <MarkerLine color="green" thickness={3} offset={4}>green marker underline</MarkerLine> below text.
                        </p>

                        <div className="text-4xl font-bold">
                            <MarkerLine color="orange" thickness={8} animated="draw">
                                IMPORTANT NOTICE
                            </MarkerLine>
                        </div>
                    </div>
                </section>

                {/* Usage Example */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Real-World Example
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                            <Highlight color="purple" variant="gradient">How to Use These Components</Highlight>
                        </h3>

                        <p className="text-gray-300 leading-relaxed">
                            These components make it easy to <Highlight color="yellow" animated="draw">emphasize important text</Highlight> in your blog posts and documentation.
                            You can <Underline type="wavy" color="accent">add stylish underlines</Underline> to draw attention,
                            or use <Badge variant="filled" color="success">NEW</Badge> badges to highlight new features.
                        </p>

                        <Notice type="info" title="Pro Tip">
                            Combine these components for maximum impact. For example, use highlights for <Highlight color="green">key concepts</Highlight>,
                            underlines for <Underline type="gradient" animated="draw">important terms</Underline>, and badges for <Badge color="warning">status indicators</Badge>.
                        </Notice>

                        <p className="text-gray-300 leading-relaxed">
                            The <Underline type="double" color="primary">best part</Underline>? All animations respect the user's
                            <code className="px-2 py-1 bg-purple-900/30 rounded text-purple-300">prefers-reduced-motion</code> setting
                            for better accessibility <Badge variant="subtle" color="success" size="sm">A11Y</Badge>.
                        </p>
                    </div>
                </section>

                {/* Code Examples */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-white border-b border-purple-500/30 pb-2">
                        Usage Code
                    </h2>

                    <div className="bg-gray-900 p-6 rounded-lg space-y-4 text-sm font-mono">
                        <div>
                            <div className="text-gray-500 mb-2">// Highlight</div>
                            <code className="text-purple-300">{`<Highlight color="yellow" animated="draw">text</Highlight>`}</code>
                        </div>

                        <div>
                            <div className="text-gray-500 mb-2">// Underline</div>
                            <code className="text-pink-300">{`<Underline type="wavy" color="accent">text</Underline>`}</code>
                        </div>

                        <div>
                            <div className="text-gray-500 mb-2">// Notice</div>
                            <code className="text-green-300">{`<Notice type="info" title="Title">content</Notice>`}</code>
                        </div>

                        <div>
                            <div className="text-gray-500 mb-2">// Badge</div>
                            <code className="text-blue-300">{`<Badge variant="filled" color="primary">NEW</Badge>`}</code>
                        </div>

                        <div>
                            <div className="text-gray-500 mb-2">// Circle</div>
                            <code className="text-red-300">{`<Circle color="red" animated="draw">text</Circle>`}</code>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
