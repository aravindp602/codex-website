import { 
  Briefcase, PenTool, User, BookOpen, DollarSign, Share2, 
  Search, FileText, Target, Mail, Rocket, TrendingUp, 
  Award, BarChart2, Layout, GitBranch, Filter, Magnet, 
  Facebook, Monitor, MousePointer, LucideIcon 
} from 'lucide-react';

export interface CodexItem {
  name: string;
  url: string;
  icon: LucideIcon;
  desc: string;
  category: 'Core' | 'Brand' | 'Growth' | 'Conversion';
}

export const codexData: CodexItem[] = [
  { name: "Business Modeller", url: "https://chatgpt.com/g/g-6908185e71fc8191be60baf3f8eb129f-business-modeler-codex", icon: Briefcase, desc: "Architect the fundamental logic of your venture.", category: 'Core' },
  { name: "Revenue Model", url: "https://chatgpt.com/g/g-6908456435b48191afb16a24b609e541-revenue-model-codex", icon: DollarSign, desc: "Engineer sustainable income streams.", category: 'Core' },
  { name: "GTM Strategy", url: "https://chatgpt.com/g/g-69084dbe2904819193f7fbc43cf6ae19-gtm-codex", icon: Rocket, desc: "Precision launch sequencing for new markets.", category: 'Core' },
  
  { name: "BrandName", url: "https://chatgpt.com/g/g-69081c7f81ac8191b0a197d5b0b35c11-brandname-codex", icon: PenTool, desc: "Linguistic engineering for brand identity.", category: 'Brand' },
  { name: "Persona", url: "https://chatgpt.com/g/g-69044ba5c6088191bee6a918192dedc2-persona-codex", icon: User, desc: "Deep psychological mapping of your ideal user.", category: 'Brand' },
  { name: "Brand Story", url: "https://chatgpt.com/g/g-69083ca9c79081919dc8ee7af19250d5-brand-story-codex", icon: BookOpen, desc: "Narrative architecture for emotional resonance.", category: 'Brand' },
  { name: "Brand Strategy", url: "https://chatgpt.com/g/g-69085293c12881918e3dc15e83912393-brand-strategy-codex", icon: Award, desc: "Long-term equity and positioning frameworks.", category: 'Brand' },

  { name: "Social Strategy", url: "https://chatgpt.com/g/g-6908480495448191a59373b56e379aa0-social-strategy-codex", icon: Share2, desc: "Viral mechanics and community architecture.", category: 'Growth' },
  { name: "SEO Strategy", url: "https://chatgpt.com/g/g-69084923b62c819196d2e6c16addd06e-seo-strategy-codex", icon: Search, desc: "Algorithmic visibility and search dominance.", category: 'Growth' },
  { name: "Content Marketing", url: "https://chatgpt.com/g/g-69084a36153c81918ed553c3f458a164-content-marketing-codex", icon: FileText, desc: "Value-driven content distribution systems.", category: 'Growth' },
  { name: "Marketing Strategy", url: "https://chatgpt.com/g/g-69084b938fc08191b6b04f89eb22255e-marketing-strategy-codex", icon: Target, desc: "Omni-channel growth orchestration.", category: 'Growth' },
  { name: "Channel Strategy", url: "https://chatgpt.com/g/g-69085dd5a2f48191ac8724963eb3560f-channel-strategy-codex", icon: GitBranch, desc: "Distribution logistics and partner modeling.", category: 'Growth' },
  { name: "Meta Ads", url: "https://chatgpt.com/g/g-69088122d74c8191ad982645feae0ea2-meta-ads-codex", icon: Facebook, desc: "Performance creative and paid scaling.", category: 'Growth' },
  { name: "RSA Ad", url: "https://chatgpt.com/g/g-690ab6a48c1c8191970398eeae104df0-rsa-ads-codex", icon: MousePointer, desc: "Responsive Search engine logic.", category: 'Growth' },

  { name: "Funnel", url: "https://chatgpt.com/g/g-690879f18d448191af3d0e3ef099b4ca-funnel-codex", icon: Filter, desc: "Conversion path optimization and leak repair.", category: 'Conversion' },
  { name: "Lead Magnet", url: "https://chatgpt.com/g/g-69087e5ccb6881918208afc0777a435b-lead-magnet-codex", icon: Magnet, desc: "High-value asset engineering for acquisition.", category: 'Conversion' },
  { name: "Landing Page Copy", url: "https://chatgpt.com/g/g-69089d50cce88191a6b989cf920b785f-landing-page-copy-codex", icon: Monitor, desc: "Direct response linguistics for high conversion.", category: 'Conversion' },
  { name: "Website Copy", url: "https://chatgpt.com/g/g-69085aeb684c8191b850c9e8d5121f9f-website-copy-codex", icon: Layout, desc: "Digital storefront messaging architecture.", category: 'Conversion' },
  { name: "Email Marketing", url: "https://chatgpt.com/g/g-69084c631b5481919a36385edff3916c-email-marketing-codex", icon: Mail, desc: "Retention loops and automated sequence design.", category: 'Conversion' },
  { name: "Sales Strategy", url: "https://chatgpt.com/g/g-69084f51231c81919bc4d4677a8870c7-sales-strategy-codex", icon: TrendingUp, desc: "Closing mechanics and deal-flow management.", category: 'Conversion' },
  { name: "Competitor Analysis", url: "https://chatgpt.com/g/g-690855d6c7c48191965906897e1e837b-competitor-analysis-codex", icon: BarChart2, desc: "Strategic reconnaissance and market positioning.", category: 'Core' },
];