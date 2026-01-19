// app/contact/page.tsx

import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: 'Contact Us - lez Market',
    description: 'Get in touch with the lez Market team for support, feedback, or enterprise inquiries.',
};

export default function ContactPage() {
    return <ContactClient />;
}
