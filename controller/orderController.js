import NodeGeocoder from 'node-geocoder'

export const addOrder =async(req , res)=>{
     const { latitude , longitude } = req.body
     console.log(req.body , process.env.GOOGLE_API_KEY);

    //  const options = {
    //     provider: 'google',
    //     // Optional depending on the providers
    //     apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, APlace, Google Premier
    //     formatter: null // 'gpx', 'string', ...
    //   };
    //   const geocoder = NodeGeocoder(options);
    // //   const result = await geocoder.reverse({ lat: latitude, lon: longitude });
    // const result = await geocoder.geocode('29 champs elysée paris');
    //  console.log(geocoder , result);

}