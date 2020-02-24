import React from "react"

const script = document.createElement("script");
script.async = true;
script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0";

class FacebookComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false
        };
    }

    componentDidMount() {
        document.body.appendChild(script);
        this.setState({mounted: true});
        console.log("FacebookComponent mounted");
        // this.forceUpdate()
    }

    componentWillUnmount() {
        document.body.removeChild(script);
        this.setState({mounted: false});
        console.log("FacebookComponent unmounted");
    }

    render() {
        if (this.state.mounted) {
            console.log("Render mounted true");
            return (
                <div>
                    <div className="fb-page" data-tabs="timeline"
                        data-href="https://www.facebook.com/Motstanden" data-small-header="false"
                        data-adapt-container-width="true" data-hide-cover="false"
                        data-show-facepile="true">
                        <blockquote className="fb-xfbml-parse-ignore" cite="https://www.facebook.com/Motstanden">
                            <a href="https://www.facebook.com/Motstanden">
                                Motstanden på Facebook
                            </a>
                        </blockquote>
                    </div>
                </div>
            )
        }
        else {
            return 0;
        }
    }
}
export default FacebookComponent

/*

data-width="" data-height="" */
