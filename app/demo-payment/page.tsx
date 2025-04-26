'use client'
import { useState } from 'react'

export default function DemoPaymentPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      phoneNumber: formData.get('phoneNumber'),
      amount: formData.get('amount'),
      fullName: formData.get('fullName'),
      emailAddress: formData.get('emailAddress'),
      currencyCode: formData.get('currencyCode'),
      countryCode: formData.get('countryCode'),
      paymentMode: formData.get('paymentMode'),
    }

    try {
      const response = await fetch('/api/payment/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      setResult(result)
    } catch (error) {
      console.error(error)
      setResult({ error: 'Failed to initiate payment' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Payment Initiation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Phone Number</label>
          <input 
            type="text" 
            name="phoneNumber"
            placeholder="e.g., 237612345678"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Amount</label>
          <input 
            type="number" 
            name="amount"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Full Name</label>
          <input 
            type="text" 
            name="fullName"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email Address</label>
          <input 
            type="email" 
            name="emailAddress"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Currency Code</label>
          <select 
            name="currencyCode"
            className="w-full border p-2 rounded"
            defaultValue="XAF"
          >
            <option value="XAF">XAF</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Country Code</label>
          <select 
            name="countryCode"
            className="w-full border p-2 rounded"
            defaultValue="CM"
          >
            <option value="CM">Cameroon (CM)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Payment Mode</label>
          <select 
            name="paymentMode"
            className="w-full border p-2 rounded"
            defaultValue="OM"
          >
            <option value="OM">Orange Money (OM)</option>
            <option value="MOMO">Mobile Money (MOMO)</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Initiate Payment'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
