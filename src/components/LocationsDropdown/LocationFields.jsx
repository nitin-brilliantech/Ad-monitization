import { useEffect, useState } from 'react';
import axios from 'axios';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

const LocationFields = ({ control, setValue, watch, errors, isPincode = true ,customStyles}) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const watchedCountry = watch('country');

  useEffect(() => {
    axios.get('https://countriesnow.space/api/v0.1/countries/positions')
      .then(res => {
        const options = res.data.data.map(c => ({ label: c.name, value: c.name }));
        setCountries(options);
        //console.log(options);
      })
      .catch(err => console.error('Error loading countries', err));
  }, []);

  const handleCountryChange = async (selected) => {
    const country = selected?.value || '';
    setValue('country', country);
    setValue('state', '');
    setValue('city', '');
    setStates([]);
    setCities([]);

    if (country) {
      try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country });
        const options = res.data.data.states.map(s => ({ label: s.name, value: s.name }));
        setStates(options);
      } catch (err) {
        console.error('Error loading states', err);
      }
    }
  };

  const handleStateChange = async (selected) => {
    const state = selected?.value || '';
    setValue('state', state);
    setValue('city', '');
    setCities([]);

    if (state && watchedCountry) {
      try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
          country: watchedCountry,
          state,
        });
        const options = res.data.data.map(c => ({ label: c, value: c }));
        setCities(options);
      } catch (err) {
        console.error('Error loading cities', err);
      }
    }
  };

  const handlePincodeChange = async (pincode) => {
    setValue('pincode', pincode);

    if (pincode.length === 6) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (res.data?.[0]?.Status === 'Success') {
          const { State, District } = res.data[0].PostOffice[0];
          const country = 'India';

          const countryOption = { label: country, value: country };
          const stateOption = { label: State, value: State };
          const cityOption = { label: District, value: District };

          setValue('country', country);
          setValue('state', State);
          setValue('city', District);

          const statesRes = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country });
          const statesOptions = statesRes.data.data.states.map(s => ({ label: s.name, value: s.name }));
          setStates(statesOptions);

          const citiesRes = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
            country,
            state: State,
          });
          const citiesOptions = citiesRes.data.data.map(c => ({ label: c, value: c }));
          setCities(citiesOptions);
        }
      } catch (err) {
        console.error('Pincode lookup failed:', err);
      }
    }
  };

  return (
    <>
      {/* Pincode (optional) */}
      {isPincode && (
        <Controller
          name="pincode"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'Pincode must be 6 digits',
            },
          }}
          render={({ field }) => (
            <div className="space-y-1">
              <label className="block text-sm">
                Pincode <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <input
                {...field}
                type="text"
                maxLength={6}
                placeholder="Enter Pincode"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handlePincodeChange(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
            </div>
          )}
        />
      )}

      {/* Country */}
      <Controller
        name="country"
        control={control}
        rules={{ required: 'Country is required' }}
        render={({ field }) => (
          <div className="space-y-1">
            <label className="block text-sm">Country</label>
            <div className={customStyles}>

            <Select
              {...field}
              options={countries}
              onChange={(selected) => {
                field.onChange(selected?.value || '');
                handleCountryChange(selected);
              }}
              value={countries.find(c => c.value === field.value) || null}
              placeholder="Select Country"
            />
            </div>
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>
        )}
      />

      {/* State */}
      <Controller
        name="state"
        control={control}
        rules={{ required: 'State is required' }}
        render={({ field }) => (
          <div className="space-y-1">
            <label className="block text-sm">State</label>
            <div className={customStyles}>

            <Select

              {...field}
              options={states}
              isDisabled={!states.length}
              onChange={(selected) => {
                field.onChange(selected?.value || '');
                handleStateChange(selected);
              }}
              value={states.find(s => s.value === field.value) || null}
              placeholder="Select State"
            />
            </div>
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
        )}
      />

      {/* City */}
      <Controller
        name="city"
        control={control}
        rules={{ required: 'City is required' }}
        render={({ field }) => (
          <div className="space-y-1">
            <label className="block text-sm">City</label>
            <div className={customStyles}>

            <Select
              {...field}
              options={cities}
              isDisabled={!cities.length}
              onChange={(selected) => {
                field.onChange(selected?.value || '');
              }}
              value={cities.find(c => c.value === field.value) || null}
              placeholder="Select City"
            />
            </div>
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>
        )}
      />
    </>
  );
};

export default LocationFields;