import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useSavedCards } from '../../hooks/useSavedCards';
import { supabase } from '../../lib/supabase';

const profileValidationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  phone: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
});

const cardValidationSchema = Yup.object({
  cardNumber: Yup.string().required('Required').matches(/^\d{16}$/, 'Invalid card number'),
  cardName: Yup.string().required('Required'),
  expiryDate: Yup.string().required('Required').matches(/^\d{2}\/\d{2}$/, 'Invalid expiry date'),
  cvv: Yup.string().required('Required').matches(/^\d{3,4}$/, 'Invalid CVV'),
});

export default function AccountSettings() {
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { cards, loading: cardsLoading, addCard, deleteCard, setDefaultCard } = useSavedCards();
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddCard, setShowAddCard] = useState(false);

  if (profileLoading || cardsLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>
          <p className="mt-2 text-gray-600">Update your profile and manage payment methods</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'payment'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment Methods
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              <Formik
                initialValues={{
                  firstName: profile?.first_name || '',
                  lastName: profile?.last_name || '',
                  phone: profile?.phone || '',
                  address: profile?.address || '',
                }}
                validationSchema={profileValidationSchema}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  try {
                    await updateProfile({
                      first_name: values.firstName,
                      last_name: values.lastName,
                      phone: values.phone,
                      address: values.address,
                    });
                    setStatus('Profile updated successfully');
                  } catch (error: any) {
                    setStatus(error.message);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
                  <Form className="space-y-6">
                    {status && (
                      <div className="p-4 rounded-md bg-green-50">
                        <p className="text-sm text-green-700">{status}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {touched.firstName && errors.firstName && (
                          <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {touched.lastName && errors.lastName && (
                          <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {touched.phone && errors.phone && (
                        <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {touched.address && errors.address && (
                        <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Saved Cards</h3>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Add New Card
                  </button>
                </div>

                <div className="space-y-4">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={`/card-brands/${card.card_brand.toLowerCase()}.svg`}
                            alt={card.card_brand}
                            className="h-8 w-8"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {card.card_brand} ending in {card.card_last_four}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires {card.expiry_date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {!card.is_default && (
                          <button
                            onClick={() => setDefaultCard(card.id)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddCard && (
                  <Formik
                    initialValues={{
                      cardNumber: '',
                      cardName: '',
                      expiryDate: '',
                      cvv: '',
                    }}
                    validationSchema={cardValidationSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      try {
                        await addCard({
                          cardNumber: values.cardNumber,
                          cardName: values.cardName,
                          expiryDate: values.expiryDate,
                          cvv: values.cvv,
                        });
                        resetForm();
                        setShowAddCard(false);
                      } catch (error: any) {
                        console.error('Error adding card:', error);
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                      <Form className="space-y-4 mt-6">
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

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={values.expiryDate}
                              onChange={handleChange}
                              onBlur={handleBlur}
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
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {touched.cvv && errors.cvv && (
                              <p className="mt-2 text-sm text-red-600">{errors.cvv}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setShowAddCard(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                          >
                            {isSubmitting ? 'Adding...' : 'Add Card'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}