'use client'
import { useState } from 'react'

export default function DemoPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      amount: formData.get('amount'),
      amountCurrency: formData.get('currency'),
      description: formData.get('description')
    }

    try {
      const response = await fetch('/api/lnbtc-invoice/create', {
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
      setResult({ error: 'Failed to create invoice' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Invoice Creation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block mb-1">Currency</label>
          <select 
            name="currency"
            className="w-full border p-2 rounded"
            required
          >
            <option value="SATs">SATs</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <input 
            type="text" 
            name="description"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Invoice'}
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
