// lib/payment/factory.ts

import { PaymentProvider, PaymentGateway } from './types';
import { PaystackProvider } from './providers/paystack';
import { PaddleProvider } from './providers/paddle';

export class PaymentFactory {
    private static instances: Map<PaymentGateway, PaymentProvider> = new Map();

    static getProvider(name?: PaymentGateway): PaymentProvider {
        const gateway = name || (process.env.NEXT_PUBLIC_PAYMENT_GATEWAY as PaymentGateway) || 'paystack';

        if (this.instances.has(gateway)) {
            return this.instances.get(gateway)!;
        }

        let provider: PaymentProvider;

        switch (gateway) {
            case 'paystack':
                provider = new PaystackProvider();
                break;
            case 'paddle':
                provider = new PaddleProvider();
                break;
            default:
                throw new Error(`Unsupported payment gateway: ${gateway}`);
        }

        this.instances.set(gateway, provider);
        return provider;
    }
}
