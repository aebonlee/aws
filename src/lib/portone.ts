declare global {
  interface Window {
    IMP: any
  }
}

interface PaymentOptions {
  planName: string
  amount: number
  buyerEmail: string
  buyerName: string
}

export function requestPayment(options: PaymentOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!window.IMP) {
      reject('PortOne SDK가 로드되지 않았습니다.')
      return
    }

    window.IMP.init(import.meta.env.VITE_IMP_CODE || 'imp61949262')
    window.IMP.request_pay(
      {
        pg: import.meta.env.VITE_PG_PROVIDER || 'html5_inicis.MOIkorcom1',
        pay_method: 'card',
        merchant_uid: `order_${Date.now()}`,
        name: options.planName,
        amount: options.amount,
        buyer_email: options.buyerEmail,
        buyer_name: options.buyerName,
      },
      (rsp: any) => {
        if (rsp.success) {
          resolve(rsp)
        } else {
          reject(rsp.error_msg)
        }
      }
    )
  })
}
