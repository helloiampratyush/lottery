import { MoralisProvider } from "react-moralis"
import "../styles/globals.css"
import { NotificationProvider } from "web3uikit"
const _app = ({ Component, pageProps }) => {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default _app
