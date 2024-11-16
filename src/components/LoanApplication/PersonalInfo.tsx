import React from 'react';
import { FormikProps } from 'formik';
import { useUserProfile } from '../../hooks/useUserProfile';

interface Props {
  formikProps: FormikProps<any>;
}

export default function PersonalInfo({ formikProps }: Props) {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikProps;
  const { profile, loading } = useUserProfile();
  const [useStoredInfo, setUseStoredInfo] = React.useState(true);

  React.useEffect(() => {
    if (profile && useStoredInfo) {
      setFieldValue('firstName', profile.first_name);
      setFieldValue('lastName', profile.last_name);
      setFieldValue('phone', profile.phone);
      setFieldValue('address', profile.address);
    }
  }, [profile, useStoredInfo, setFieldValue]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {profile && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <button
            type="button"
            onClick={() => {
              setUseStoredInfo(!useStoredInfo);
              if (!useStoredInfo) {
                setFieldValue('firstName', profile.first_name);
                setFieldValue('lastName', profile.last_name);
                setFieldValue('phone', profile.phone);
                setFieldValue('address', profile.address);
              } else {
                setFieldValue('firstName', '');
                setFieldValue('lastName', '');
                setFieldValue('phone', '');
                setFieldValue('address', '');
              }
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {useStoredInfo ? 'Enter new information' : 'Use stored information'}
          </button>
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        {touched.email && errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
        )}
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
    </div>
  );
}