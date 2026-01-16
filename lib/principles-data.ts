// lib/principles-data.ts
// Centralized data for all persuasion principles

import { 
    Users, Shield, Award, Clock, Sparkles, DollarSign, 
    Quote, AlertTriangle, BookOpen, Package, Eye, Zap,
    CheckCircle, TrendingUp, Target, Percent, Users2, AlertCircle
} from 'lucide-react';

export interface PrincipleData {
    slug: string;
    name: string;
    icon: any;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    description: string;
    whatIs: string;
    impactStat: string;
    types: {
        icon: any;
        title: string;
        description: string;
    }[];
    steps: {
        title: string;
        description: string;
        example?: {
            type: 'code' | 'comparison' | 'visual' | 'list';
            content: any;
        };
        difficulty?: string;
        impact?: string;
    }[];
    bestPractices: string[];
    warning?: {
        title: string;
        content: string;
    };
    examples?: string[];
}

export const principlesData: Record<string, PrincipleData> = {
    'social-proof': {
        slug: 'social-proof',
        name: 'Social Proof',
        icon: Users,
        color: 'purple',
        gradientFrom: 'purple-50',
        gradientTo: 'blue-50',
        description: 'Leverage the power of numbers, testimonials, and trust signals to increase conversions',
        whatIs: 'Social proof is the psychological phenomenon where people conform to the actions of others under the assumption that those actions are the correct behavior. When visitors see that others trust and use your product, they\'re more likely to do the same.',
        impactStat: '📊 Can increase conversions by up to 34%',
        types: [
            {
                icon: Quote,
                title: 'Customer Testimonials',
                description: 'Real quotes from satisfied customers with names, photos, and company affiliations'
            },
            {
                icon: Users,
                title: 'User Count',
                description: 'Display the number of customers, users, or downloads to show popularity'
            },
            {
                icon: CheckCircle,
                title: 'Ratings & Reviews',
                description: 'Show star ratings, review counts, and excerpts from review platforms'
            },
            {
                icon: CheckCircle,
                title: 'Trust Badges',
                description: 'Security seals, certifications, and logos of well-known clients or partners'
            }
        ],
        steps: [
            {
                title: 'Add Customer Testimonials',
                description: 'Place 3-5 testimonials on your homepage, preferably with real photos and full names',
                example: {
                    type: 'code',
                    content: '"This tool increased our conversion rate by 45% in just 2 weeks!"\n— Sarah Johnson, Marketing Director at TechCorp'
                }
            },
            {
                title: 'Display User Numbers',
                description: 'Add a prominent stat like "Join 50,000+ happy customers" near your main CTA',
                difficulty: 'Easy',
                impact: 'High'
            },
            {
                title: 'Show Star Ratings',
                description: 'Integrate ratings from Google, Trustpilot, or G2 with review count',
                example: {
                    type: 'visual',
                    content: '⭐⭐⭐⭐⭐ 4.9/5 (2,847 reviews)'
                }
            },
            {
                title: 'Add Trust Badges',
                description: 'Display security certifications, payment badges, and client logos',
                example: {
                    type: 'list',
                    content: [
                        'SSL certificate badge',
                        'Payment processor logos (Stripe, PayPal)',
                        'Industry certifications',
                        '"As seen in" media logos'
                    ]
                }
            }
        ],
        bestPractices: [
            'Use real data: Never fabricate testimonials or numbers',
            'Add photos: Testimonials with photos are 5x more credible',
            'Be specific: "10,000+ users" is better than "thousands of users"',
            'Update regularly: Keep numbers and testimonials current',
            'Place strategically: Position near CTAs and decision points'
        ]
    },

    'loss-aversion': {
        slug: 'loss-aversion',
        name: 'Loss Aversion',
        icon: Shield,
        color: 'red',
        gradientFrom: 'red-50',
        gradientTo: 'orange-50',
        description: 'People are more motivated to avoid losses than to acquire equivalent gains',
        whatIs: 'Loss aversion is a cognitive bias where the pain of losing is psychologically twice as powerful as the pleasure of gaining. In marketing, framing your offer around what customers stand to lose (rather than gain) can significantly increase conversions.',
        impactStat: '📊 Can increase response rates by up to 250%',
        types: [
            {
                icon: AlertTriangle,
                title: 'Risk Reversal',
                description: 'Money-back guarantees, free trials, and "no risk" promises reduce the fear of loss'
            },
            {
                icon: Clock,
                title: 'Time-Limited Offers',
                description: 'Create urgency by emphasizing what they\'ll miss if they don\'t act now'
            },
            {
                icon: TrendingUp,
                title: 'Cost of Inaction',
                description: 'Show what prospects lose by not choosing your solution'
            },
            {
                icon: Shield,
                title: 'Exit Intent Popups',
                description: 'Capture attention when users are about to leave with a compelling offer'
            }
        ],
        steps: [
            {
                title: 'Add Money-Back Guarantee',
                description: 'Eliminate purchase risk with a clear, prominent guarantee',
                example: {
                    type: 'code',
                    content: '✓ 60-Day Money-Back Guarantee\nNot satisfied? Get a full refund, no questions asked.'
                }
            },
            {
                title: 'Reframe Headlines Negatively',
                description: 'Instead of "Gain X", say "Stop Losing Y" or "Don\'t Miss Out"',
                example: {
                    type: 'comparison',
                    content: {
                        bad: 'Save 30% on your energy bills',
                        good: 'Stop wasting $500/month on high energy costs'
                    }
                }
            },
            {
                title: 'Create Urgency with Time Limits',
                description: 'Add countdown timers or deadline messaging to emphasize potential loss',
                difficulty: 'Easy',
                impact: 'High',
                example: {
                    type: 'visual',
                    content: '⏰ Special offer ends in 2 hours 43 minutes'
                }
            },
            {
                title: 'Show Cost of Inaction',
                description: 'Use calculators or stats to demonstrate what they\'re currently losing',
                example: {
                    type: 'code',
                    content: 'Without proper analytics, you\'re losing an average of $12,000/year in missed opportunities.'
                }
            },
            {
                title: 'Offer Free Trials',
                description: 'Let users experience your product before committing, reducing perceived risk',
                example: {
                    type: 'list',
                    content: [
                        '14-day free trial (no credit card required)',
                        'Free tier with upgrade options',
                        'Demo account with sample data'
                    ]
                }
            }
        ],
        bestPractices: [
            'Be honest: Never create fake scarcity or false deadlines',
            'Make guarantees prominent: Display them near CTAs and checkout',
            'Use specific numbers: "$500" is better than "hundreds of dollars"',
            'Balance positive and negative: Don\'t be too fear-focused',
            'Test timing: A/B test different urgency timeframes'
        ]
    },

    'authority': {
        slug: 'authority',
        name: 'Authority',
        icon: Award,
        color: 'blue',
        gradientFrom: 'blue-50',
        gradientTo: 'indigo-50',
        description: 'Establish credibility and expertise to build trust with your audience',
        whatIs: 'People are more likely to trust and follow the advice of perceived experts and authoritative sources. By demonstrating expertise, credentials, and industry recognition, you can significantly increase trust and conversion rates.',
        impactStat: '📊 Can increase trust perception by up to 60%',
        types: [
            {
                icon: Award,
                title: 'Credentials & Certifications',
                description: 'Degrees, industry certifications, and professional qualifications'
            },
            {
                icon: BookOpen,
                title: 'Thought Leadership',
                description: 'Published articles, books, speaking engagements, and media appearances'
            },
            {
                icon: Users2,
                title: 'Team Expertise',
                description: 'Years of experience, team size, and backgrounds of key members'
            },
            {
                icon: TrendingUp,
                title: 'Industry Recognition',
                description: 'Awards, rankings, media mentions, and partnerships with known brands'
            }
        ],
        steps: [
            {
                title: 'Showcase Team Credentials',
                description: 'Create an "About Us" or "Team" section highlighting expertise',
                example: {
                    type: 'code',
                    content: 'Dr. Jane Smith, PhD\n15+ years in digital marketing | Former CMO at Fortune 500 | Published author of "Conversion Secrets"'
                }
            },
            {
                title: 'Display Awards & Recognition',
                description: 'Show industry awards, certifications, and accolades prominently',
                difficulty: 'Easy',
                impact: 'Medium',
                example: {
                    type: 'visual',
                    content: '🏆 Best Marketing Tool 2025 | ⭐ G2 Leader | ✓ SOC 2 Certified'
                }
            },
            {
                title: 'Add "As Featured In" Section',
                description: 'Show logos of media outlets, publications, or podcasts that featured you',
                example: {
                    type: 'visual',
                    content: 'AS SEEN IN: TechCrunch | Forbes | Wired | Inc.'
                }
            },
            {
                title: 'Publish Original Research',
                description: 'Create whitepapers, case studies, or industry reports to demonstrate expertise',
                example: {
                    type: 'list',
                    content: [
                        'Annual industry benchmark reports',
                        'Original research studies with data',
                        'Detailed case studies with results',
                        'Educational blog content'
                    ]
                }
            },
            {
                title: 'Show Years of Experience',
                description: 'Highlight how long you\'ve been in business or solving this problem',
                example: {
                    type: 'code',
                    content: 'Trusted by 10,000+ businesses since 2015\nOver 8 years of proven expertise in conversion optimization'
                }
            }
        ],
        bestPractices: [
            'Be specific: Vague claims hurt more than they help',
            'Use professional photos: Team photos build human connection',
            'Link to proof: Make credentials verifiable when possible',
            'Update regularly: Keep credentials and stats current',
            'Balance humility: Show expertise without being arrogant'
        ]
    },

    'scarcity': {
        slug: 'scarcity',
        name: 'Scarcity & Urgency',
        icon: Clock,
        color: 'orange',
        gradientFrom: 'orange-50',
        gradientTo: 'yellow-50',
        description: 'Create demand by highlighting limited availability and time constraints',
        whatIs: 'Scarcity is the psychological principle that people place higher value on things that are rare or in limited supply. When combined with urgency (time constraints), scarcity creates immediate motivation to take action before the opportunity disappears.',
        impactStat: '📊 Can increase conversions by up to 226%',
        types: [
            {
                icon: Clock,
                title: 'Time-Based Scarcity',
                description: 'Limited-time offers, countdown timers, flash sales, and expiring deals'
            },
            {
                icon: Package,
                title: 'Quantity-Based Scarcity',
                description: 'Limited stock, limited seats, "only X left" messages, and exclusive access'
            },
            {
                icon: AlertCircle,
                title: 'Demand-Based Scarcity',
                description: '"High demand", "trending now", "selling fast" indicators'
            },
            {
                icon: TrendingUp,
                title: 'Seasonal Scarcity',
                description: 'Holiday promotions, seasonal launches, and event-specific offers'
            }
        ],
        steps: [
            {
                title: 'Add Countdown Timers',
                description: 'Display real-time countdown for offers, launches, or registrations',
                example: {
                    type: 'visual',
                    content: '🔥 50% OFF - Limited Time Offer\n02 HRS : 43 MIN'
                }
            },
            {
                title: 'Show Stock Levels',
                description: 'Display remaining inventory or available spots',
                difficulty: 'Easy',
                impact: 'High',
                example: {
                    type: 'visual',
                    content: 'Only 3 left in stock [Progress Bar: 15%]'
                }
            },
            {
                title: 'Add "Other Users Looking" Notifications',
                description: 'Show live activity to create competitive urgency',
                example: {
                    type: 'list',
                    content: [
                        '👀 12 people are viewing this right now',
                        '🔥 3 people bought this in the last hour'
                    ]
                }
            },
            {
                title: 'Create Limited-Tier Offers',
                description: 'Offer exclusive early-bird pricing or VIP access to first X customers',
                example: {
                    type: 'comparison',
                    content: {
                        bad: 'Regular: $99/mo',
                        good: 'Early Bird: $49/mo (First 100 customers)'
                    }
                }
            },
            {
                title: 'Use Expiring Offers',
                description: 'Set clear deadlines for promotions, bonuses, or special pricing',
                example: {
                    type: 'list',
                    content: [
                        'Offer ends midnight January 20th',
                        'Get 3 months free - expires in 48 hours',
                        'Last chance: bonus ends Sunday',
                        'Register by Friday to qualify'
                    ]
                }
            }
        ],
        bestPractices: [
            'Always be truthful: Fake scarcity destroys trust permanently',
            'Make it real: Use actual inventory counts and genuine deadlines',
            'Don\'t overdo it: Too much urgency can feel manipulative',
            'Be specific: "Ends Jan 20" is better than "ends soon"',
            'Test placement: Try scarcity messages at different funnel stages'
        ],
        warning: {
            title: '⚠️ Important Warning',
            content: 'Fake scarcity tactics (evergreen countdown timers, false stock levels) are unethical and often illegal under consumer protection laws. They damage brand reputation and customer trust. Only use real, verifiable scarcity and urgency.'
        }
    },

    'cognitive-ease': {
        slug: 'cognitive-ease',
        name: 'Cognitive Ease',
        icon: Sparkles,
        color: 'green',
        gradientFrom: 'green-50',
        gradientTo: 'emerald-50',
        description: 'Reduce mental effort to increase engagement and conversion rates',
        whatIs: 'Cognitive ease refers to how easy it is for the brain to process information. When content is easy to read, understand, and navigate, people feel more comfortable and are more likely to trust and act on it. Reducing cognitive load leads to better user experience and higher conversions.',
        impactStat: '📊 Can improve comprehension by up to 80%',
        types: [
            {
                icon: Eye,
                title: 'Visual Clarity',
                description: 'Clean design, plenty of white space, and readable typography'
            },
            {
                icon: Zap,
                title: 'Simple Language',
                description: 'Clear, concise copy without jargon or complex terminology'
            },
            {
                icon: Sparkles,
                title: 'Intuitive Navigation',
                description: 'Easy-to-find information with logical structure and clear CTAs'
            },
            {
                icon: TrendingUp,
                title: 'Fast Load Times',
                description: 'Quick page loads and responsive interactions'
            }
        ],
        steps: [
            {
                title: 'Improve Typography & Readability',
                description: 'Use large, readable fonts with proper line spacing and contrast',
                example: {
                    type: 'list',
                    content: [
                        'Minimum 16px font size for body text',
                        'Line height of 1.5-1.6',
                        'High contrast (4.5:1 ratio minimum)',
                        'Max 60-70 characters per line'
                    ]
                }
            },
            {
                title: 'Simplify Your Copy',
                description: 'Use short sentences, bullet points, and conversational language',
                difficulty: 'Easy',
                impact: 'High',
                example: {
                    type: 'comparison',
                    content: {
                        bad: 'Utilize our sophisticated algorithmic framework to optimize your digital marketing initiatives',
                        good: 'Use our AI to improve your marketing results'
                    }
                }
            },
            {
                title: 'Use Visual Hierarchy',
                description: 'Make the most important content stand out with size, color, and position',
                example: {
                    type: 'list',
                    content: [
                        'Headlines: 2-3x larger than body text',
                        'Use color to highlight CTAs',
                        'Position key info "above the fold"',
                        'Add clear section headings',
                        'Break up text with images/icons'
                    ]
                }
            },
            {
                title: 'Reduce Form Fields',
                description: 'Only ask for essential information - each field reduces conversion by ~7%',
                example: {
                    type: 'comparison',
                    content: {
                        bad: 'Name • Email • Phone • Company • Job Title • Industry • Company Size • Budget • Timeline',
                        good: 'Email (Ask for more later)'
                    }
                }
            },
            {
                title: 'Add White Space',
                description: 'Give content room to breathe - cramped layouts overwhelm visitors',
                example: {
                    type: 'list',
                    content: [
                        'Margins between sections (40-80px)',
                        'Padding inside content blocks (20-30px)',
                        'Space between list items (10-15px)'
                    ]
                }
            },
            {
                title: 'Optimize Page Speed',
                description: 'Fast loading creates positive first impression and reduces bounce rate',
                example: {
                    type: 'list',
                    content: [
                        'Compress images (use WebP format)',
                        'Minimize JavaScript and CSS',
                        'Use CDN for static assets',
                        'Enable browser caching',
                        'Target under 3 seconds load time'
                    ]
                }
            }
        ],
        bestPractices: [
            'Test readability: Aim for 8th-grade reading level for general audiences',
            'Use familiar patterns: Don\'t reinvent standard UI elements',
            'Chunk information: Group related content into digestible sections',
            'Limit choices: Too many options cause decision paralysis',
            'Mobile-first: Ensure ease on all devices, especially mobile'
        ]
    },

    'pricing-psychology': {
        slug: 'pricing-psychology',
        name: 'Pricing Psychology',
        icon: DollarSign,
        color: 'emerald',
        gradientFrom: 'emerald-50',
        gradientTo: 'teal-50',
        description: 'Use psychological pricing strategies to maximize perceived value and conversions',
        whatIs: 'Pricing psychology involves using specific pricing strategies that influence how customers perceive value. Small changes in how prices are displayed, formatted, and positioned can significantly impact purchase decisions without changing the actual price.',
        impactStat: '📊 Can increase conversions by up to 30%',
        types: [
            {
                icon: DollarSign,
                title: 'Charm Pricing',
                description: 'Prices ending in .99 or .95 appear significantly lower ($19.99 vs $20)'
            },
            {
                icon: Target,
                title: 'Anchoring',
                description: 'Show a higher "original" price to make the sale price look better'
            },
            {
                icon: Percent,
                title: 'Decoy Pricing',
                description: 'Add a third option to make your target plan look more appealing'
            },
            {
                icon: TrendingUp,
                title: 'Value Framing',
                description: 'Break down costs into smaller units ("just $3/day" vs "$1,095/year")'
            }
        ],
        steps: [
            {
                title: 'Use Charm Pricing',
                description: 'End prices in .99, .95, or .97 instead of round numbers',
                difficulty: 'Easy',
                impact: 'Medium',
                example: {
                    type: 'comparison',
                    content: {
                        bad: '$100',
                        good: '$99'
                    }
                }
            },
            {
                title: 'Show Price Anchors',
                description: 'Display the original price alongside your sale price',
                example: {
                    type: 'visual',
                    content: '$199 → $99 [Save 50%]'
                }
            },
            {
                title: 'Create a Three-Tier Pricing Structure',
                description: 'Offer Basic, Pro, and Premium tiers - most people choose the middle option',
                example: {
                    type: 'visual',
                    content: 'Basic: $29 | Pro: $79 [POPULAR] | Premium: $199'
                }
            },
            {
                title: 'Break Down the Cost',
                description: 'Show price in smallest meaningful units to reduce sticker shock',
                example: {
                    type: 'comparison',
                    content: {
                        bad: '$1,188/year',
                        good: '$99/month or just $3.30/day'
                    }
                }
            },
            {
                title: 'Remove Currency Symbols',
                description: 'Studies show removing $ symbols can reduce price pain',
                example: {
                    type: 'visual',
                    content: 'Pro Plan: 99 per month'
                }
            },
            {
                title: 'Highlight Savings, Not Cost',
                description: 'Frame annual plans around savings rather than upfront cost',
                example: {
                    type: 'code',
                    content: 'Annual Plan: $79/mo [Save $240]\nBilled annually ($948) • 2 months free'
                }
            },
            {
                title: 'Use Price Comparison',
                description: 'Show what customers would pay for alternatives',
                example: {
                    type: 'code',
                    content: 'Our Tool: $99/month\nvs. hiring an agency: $5,000/month\nSave $58,800/year'
                }
            }
        ],
        bestPractices: [
            'A/B test pricing: Small changes can have big impacts',
            'Make your target plan obvious: Use "Popular" or "Recommended" badges',
            'Show ROI: Help customers justify the purchase with value calculations',
            'Reduce font size: Smaller fonts for prices can reduce price sensitivity',
            'Bundle smartly: Bundles feel like better value than individual items'
        ],
        examples: [
            'Netflix: Shows monthly price, not annual ($15.99/mo vs $191.88/year)',
            'Amazon: Prime is "$12.99/month" or "just $0.43/day"',
            'Apple: "From $999" makes flagship products seem more accessible',
            'SaaS tools: Most use .99 pricing and three-tier structures'
        ]
    }
};

// Helper to get principle data by slug
export function getPrincipleBySlug(slug: string): PrincipleData | undefined {
    return principlesData[slug];
}

// Get all principle slugs for static generation
export function getAllPrincipleSlugs(): string[] {
    return Object.keys(principlesData);
}

// Map principle name to slug (for ScoreCard component)
export function getPrincipleSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
}
