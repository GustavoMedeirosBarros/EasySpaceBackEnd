
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'TESTACCESSTOKEN' });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                token,
                issuer_id,
                payment_method_id,
                transaction_amount,
                installments,
                payer_email,
                payer_doc_type,
                payer_doc_number
            } = req.body;

            const payment = new Payment(client);

            const body = {
                transaction_amount: Number(transaction_amount),
                token: token,
                description: 'Reserva EasySpace',
                installments: Number(installments),
                payment_method_id: payment_method_id,
                issuer_id: issuer_id,
                payer: {
                    email: payer_email,
                    identification: {
                        type: payer_doc_type,
                        number: payer_doc_number
                    }
                }
            };

            const result = await payment.create({ body });

            return res.status(200).json({
                status: result.status,
                status_detail: result.status_detail,
                id: result.id
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Erro ao processar pagamento',
                details: error.message
            });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}