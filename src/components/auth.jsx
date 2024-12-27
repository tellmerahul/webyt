"use client";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null)
    const [view, setView] = useState(false)
    const [channelname, setChannelName] = useState('')
    const router = useRouter();

    const loginAndConnect = async () => {
        const oauthEP = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            redirect_uri: "http://localhost:3000",
            response_type: "token",
            scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.readonly",
            include_granted_scopes: "true",
            state: "pass-through-value"
        });
        window.location.href = `${oauthEP}?${params.toString()}`;
    };

    useEffect(() => {
        const localToken = localStorage.getItem('authToken');
        if (localToken) {
            setToken(localToken);
        }
        const hash = window.location.hash;
        if (hash.includes('access_token')) {
            const urlParams = new URLSearchParams(hash.replace('#', ''));
            const accessToken = urlParams.get('access_token');
            if (accessToken) {
                storeTokenInLS(accessToken);
                window.history.replaceState(null, null, ' ');
            }
        }
    }, []);

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        localStorage.setItem('authToken', serverToken);
    };

    const logout = async () => {
        if (token) {
            try {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            } catch (error) {
                console.error('Error revoking token:', error.message);
            }
        }

        setToken(null);
        localStorage.removeItem('authToken');
        router.push('/');
    };


    async function getYouTubeChannelDetails(accessToken) {
        setLoading(true);
        const url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching YouTube data: ${response.statusText}`);
            }

            const data = await response.json();
            const channelId = data?.items[0].id;
            const channelName = data?.items[0].snippet?.localized?.title;

            const isPresent = await checkIsPresent(channelId);
            if (!isPresent) {
                const createResponse = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ channelName, channelId }),
                });

                const result = await createResponse.json();

                if (!result.success) {
                    alert(result.message);
                    return router.push('/');
                }
                else {
                    if (userInfo) {
                        await fetch('/api/sendMail', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: userInfo.given_name,
                                email: userInfo.email,
                                website: "www.google.com",
                            }),
                        });
                    }
                    alert(result.message);
                    setChannelName(channelName)
                    // await fetchID(channelName)
                    setView(true)
                    // const isLocal = window.location.hostname === 'localhost';

                    // if (isLocal) {
                    //     router.push(`/Channel/${encodeURIComponent(channelName)}`);
                    // } else {
                    //     router.push(`https://${encodeURIComponent(channelName)}.${baseDomain}`);
                    // }
                    // return router.push(`http://${encodeURIComponent(channelName)}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`);
                }
            }
            setChannelName(channelName)
            // await fetchID(channelName)
            setView(true)
            // const isLocal = window.location.hostname === 'localhost';
            // if (isLocal) {
            //     router.push(`/Channel/${encodeURIComponent(channelName)}`);
            // } else {
            //     router.push(`https://${encodeURIComponent(channelName)}.${baseDomain}`);
            // }
            // router.push(`http://${encodeURIComponent(channelName)}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`);
        } catch (error) {
            console.error('Error fetching YouTube channel details:', error);
            return null;
        }
        finally {
            setLoading(false);
        }
    }

    async function checkIsPresent(id) {
        try {
            const response = await fetch(`/api/user?id=${id}`, {
                method: 'GET',
            });
            const res = await response.json();
            if (res.success) {
                return res.message
            }
            else {
                return res.message;
            }
        }
        catch (err) {
            alert(`Error checking user in db: ${err.message}`)
        }
    }

    return (
        <AuthContext.Provider
            value={{ loginAndConnect, view, setUserInfo, channelname, storeTokenInLS, logout, getYouTubeChannelDetails, token, loading, setLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return authContextValue;
};