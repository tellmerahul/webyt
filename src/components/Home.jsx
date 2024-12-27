"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from './auth';
import Link from 'next/link';
const Home = () => {
  const { loading, getYouTubeChannelDetails, channelname, view, setUserInfo, loginAndContinue } = useAuth();
  const [token, setToken] = useState(null);
  const [userDetail, setUserDetail] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      setToken(authToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userInfo = await response.json();
            setUserDetail(userInfo);
            setUserInfo(userInfo)
          } else {
            console.error('Failed to fetch user info:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to fetch user details:', error.message);
        }
      };

      fetchUserDetails();
    }
  }, [token]);


  return (
    <>
      <div className="min-h-screen flex flex-col relative overflow-hidden">

        <div className="background">
          <div className="circle small shade1"></div>
          <div className="circle medium shade2"></div>
          <div className="circle large shade3"></div>
          <div className="circle xlarge shade4"></div>
          <div className="circle xxlarge shade5"></div>
        </div>

        <main className="flex-grow">

          <section
            id="home"
            className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600">
            <div className="absolute inset-0 w-full h-full bg-[url('/path-Of-image.jpg')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-90"></div>

            <div className="relative z-10 text-center px-4">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white animate-pulse">


                Take Your YouTube Channel to New Heights
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-gray-200">
                Build a stunning website and grow your audience with Web.yt
              </p>
              {userDetail && (
                <>
                  <div className='text-center mb-2 text-xl font-bold'>
                    <span className='mr-1'>{userDetail.given_name}</span>
                    <span>{userDetail.family_name}</span>
                  </div>
                  {userDetail.picture && (
                    <img
                      src={userDetail.picture}
                      alt={`${userDetail.given_name} ${userDetail.family_name}`}
                      className='w-[100px] h-[100px] text-center mx-auto rounded-full' // Added 'rounded-full' for circular image
                    />
                  )}
                </>
              )}


              {
                (view && channelname) ? <>
                  <Link className="mt-8 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300" href={`http://${encodeURIComponent(channelname)}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`}>
                    View 🎉
                  </Link>
                </> : <>

                  {
                    userDetail ? <button className="mt-8 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300" disabled={loading} onClick={() => getYouTubeChannelDetails(token)}>
                      {
                        loading ? "Creating..." : "Create Website"
                      }
                    </button> : <button className="mt-8 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300" onClick={loginAndContinue}>
                      Get Started
                    </button>
                  }</>
              }
            </div>

            <div className="absolute w-full h-full top-0 left-0 bg-gradient-radial from-purple-500/60 via-transparent to-indigo-600 opacity-30 animate-spin-slow"></div>
          </section>


          <section id="features" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-100">
            <div className="absolute inset-0 overflow-hidden">
              <div className="w-64 h-64 bg-gradient-to-r from-pink-200 to-yellow-200 rounded-full absolute top-20 left-15 animate-bounce-slow"></div>
              <div className="w-72 h-72 bg-gradient-to-r from-green-200 to-blue-200 rounded-full absolute bottom-10 right-10 animate-bounce-slow"></div>
            </div>

            <div className="relative z-10 text-center px-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-slide-in">Explore Our Awesome Features</h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8 animate-fade-in">Packed with tools to boost your YouTube presence.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg hover:scale-105 hover:bg-gradient-to-r from-yellow-400 to-pink-400 transition duration-300">
                  <span className="text-5xl text-yellow-400">🔒</span>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-4">Secure Google Sign-In</h3>
                  <p className="text-gray-500 mt-2">Log in easily and securely with your Google account.</p>
                </div>

                <div className="group relative bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg hover:scale-105 hover:bg-gradient-to-r from-red-400 to-yellow-400 transition duration-300">
                  <span className="text-5xl text-red-300">🎥</span>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-4">Auto YouTube Integration</h3>
                  <p className="text-gray-500 mt-2">Sync your channel for real-time updates and display.</p>
                </div>

                <div className="group relative bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg hover:scale-105 hover:bg-gradient-to-r from-indigo-400 to-purple-400 transition duration-300">
                  <span className="text-5xl text-indigo-300">🖼️</span>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-4">Custom Website Templates</h3>
                  <p className="text-gray-500 mt-2">Choose from beautiful, responsive templates.</p>
                </div>

                <div className="group relative bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg hover:scale-105 hover:bg-gradient-to-r from-green-400 to-teal-400 transition duration-300">
                  <span className="text-5xl text-green-300">📈</span>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-4">SEO & Analytics Tools</h3>
                  <p className="text-gray-500 mt-2">Optimize visibility with built-in SEO tools.</p>
                </div>
              </div>
            </div>
          </section>


          <section id="about" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-100 overflow-hidden">
            <div className="absolute inset-0">
              <div className="w-64 h-64 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full absolute top-10 left-15 animate-bounce-slow"></div>
              <div className="w-72 h-72 bg-gradient-to-r from-green-300 to-blue-300 rounded-full absolute bottom-20 right-20 animate-bounce-slow"></div>
            </div>
            <div className="relative z-10 text-center max-w-3xl px-6">
              <h2 className="text-5xl font-semibold text-gray-800 mb-6 animate-fade-in-up">About Us</h2>
              <p className="text-xl text-gray-600 mb-8 animate-fade-in-up delay-200">
                Web.yt helps content creators transform their YouTube channels into fully functional websites, optimized for engagement and growth.
              </p>
              <a href="#contact" className="inline-block px-6 py-3 bg-indigo-500 text-white text-lg font-medium rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out animate-fade-in-up delay-400">
                Get Started
              </a>
            </div>
          </section>

          {/* pricing */}
          <section id="pricing" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-100 overflow-hidden">
            <div className="absolute inset-0">
              <div className="w-64 h-64 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full absolute top-10 left-10 animate-bounce-slow"></div>
              <div className="w-72 h-72 bg-gradient-to-r from-teal-200 to-green-200 rounded-full absolute bottom-10 right-10 animate-bounce-slow"></div>
            </div>

            <div className="relative z-10 text-center max-w-3xl px-6">
              <h2 className="text-5xl font-semibold text-gray-800 mb-6 animate-fade-in-up">Pricing Plans</h2>
              <p className="text-lg text-gray-600 mb-8 animate-fade-in-up delay-200">
                Choose the plan that suits you best and start your journey with Web.yt.
              </p>

              <ul className="mt-4 space-y-6">
                <li className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fade-in-up delay-300">
                  <h3 className="text-2xl font-bold">💻 Free Plan</h3>
                  <p className="text-gray-600 mt-2">Basic features for beginners to get started.</p>
                  <p className="text-blue-600 font-semibold mt-2">Price: $0/month</p>
                </li>
                <li className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fade-in-up delay-400">
                  <h3 className="text-2xl font-bold">🌟 Hobbyist Plan</h3>
                  <p className="text-gray-600 mt-2">Additional features for passionate creators.</p>
                  <p className="text-blue-600 font-semibold mt-2">Price: $9/month</p>
                </li>
                <li className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fade-in-up delay-500">
                  <h3 className="text-2xl font-bold">🎬 Producer Plan</h3>
                  <p className="text-gray-600 mt-2">Full access for professional creators.</p>
                  <p className="text-blue-600 font-semibold mt-2">Price: $19/month</p>
                </li>
              </ul>
            </div>
          </section>

          {/* contact form */}
          <section id="contact" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-blue-100 to-teal-100 overflow-hidden">
            <div className="absolute inset-0">
              <div className="w-64 h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full absolute top-10 left-10 animate-bounce-slow"></div>
              <div className="w-72 h-72 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full absolute bottom-10 right-10 animate-bounce-slow"></div>
            </div>

            <div className="relative z-10 text-center max-w-2xl px-6">
              <h2 className="text-5xl font-semibold text-gray-800 mb-6 animate-fade-in-up">Contact Us</h2>
              <p className="text-lg text-gray-600 mb-8 animate-fade-in-up delay-200">Have any questions? Feel free to reach out!</p>

              <form className="bg-white rounded-lg shadow-lg p-8 space-y-4 animate-fade-in-up delay-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="name">Your Name</label>
                  <input type="text" id="name" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300" placeholder="Enter your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">Your Email</label>
                  <input type="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300" placeholder="Enter your email" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="message">Your Message</label>
                  <textarea id="message" rows="4" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300" placeholder="Write your message" required></textarea>
                </div>
                <button type="submit" className="block w-full py-3 px-6 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out">
                  Send Message
                </button>
              </form>
            </div>
          </section>

        </main>

        <footer className="bg-blue-600 text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <p>&copy; 2024 Web.yt. All rights reserved.</p>
              <div>
                <a href="#privacy" className="text-sm px-2">Privacy Policy</a>
                <a href="#terms" className="text-sm px-2">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        <style jsx>{`
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1; /* Ensure circles are behind content */
  }

  .circle {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: ripple 15s infinite;
    box-shadow: 0px 0px 1px 0px #508fb9;
  }

  .small {
    width: 200px;
    height: 200px;
    left: -100px;
    bottom: -100px;
  }

  .medium {
    width: 400px;
    height: 400px;
    left: -200px;
    bottom: -200px;
  }

  .large {
    width: 600px;
    height: 600px;
    left: -300px;
    bottom: -300px;
  }

  .xlarge {
    width: 800px;
    height: 800px;
    left: -400px;
    bottom: -400px;
  }

  .xxlarge {
    width: 1000px;
    height: 1000px;
    left: -500px;
    bottom: -500px;
  }

  .shade1 {
    opacity: 0.2;
  }
  .shade2 {
    opacity: 0.5;
  }
  .shade3 {
    opacity: 0.7;
  }
  .shade4 {
    opacity: 0.8;
  }
  .shade5 {
    opacity: 0.9;
  }

  @keyframes ripple {
    0% {
      transform: scale(0.8);
    }
    
    50% {
      transform: scale(1.2);
    }
    
    100% {
      transform: scale(0.8);
    }
  }
`}</style>
      </div >
    </>
  );
};

export default Home;