import React from 'react';
import { FormikProps } from 'formik';
import { CreditCard } from 'lucide-react';
import { useSavedCards } from '../../hooks/useSavedCards';

interface Props {
  formikProps: FormikProps<any>;
}

export default function CreditCardInfo({ formikProps }: Props) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikProps;
  const { cards, loading } = useSavedCards();
  const [useNewCard, setUseNewCard] = React.useState(!cards.length);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md flex items-center space-x-3">
        <CreditCard className="h-6 w-6 text-primary-600" />
        <p className="text-sm text-gray-600">
          Your payment information is encrypted and secure
        </p>
      </div>

      {cards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Saved Cards</h3>
            <button
              type="button"
              onClick={() => setUseNewCard(!useNewCard)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {useNewCard ? 'Use saved card' : 'Use new card'}
            </button>
          </div>

          {!useNewCard && (
            <div className="space-y-4">
              {cards.map((card) => (
                <label key={card.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="savedCard"
                    value={card.id}
                    checked={values.savedCard === card.id}
                    onChange={() => {
                      setFieldValue('savedCard', card.id);
                      setFieldValue('useNewCard', false);
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {card.card_brand} ending in {card.card_last_four}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {card.expiry_date}
                    </p>
                  </div>
                  {card.is_default && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Default
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {useNewCard && (
        <>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={values.cardNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {touched.cardNumber && errors.cardNumber && (
              <p className="mt-2 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={values.cardName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {touched.cardName && errors.cardName && (
              <p className="mt-2 text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={values.expiryDate}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {touched.expiryDate && errors.expiryDate && (
                <p className="mt-2 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={values.cvv}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {touched.cvv && errors.cvv && (
                <p className="mt-2 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="saveCard"
              name="saveCard"
              type="checkbox"
              checked={values.saveCard}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-900">
              Save this card for future use
            </label>
          </div>
        </>
      )}
    </div>
  );
}