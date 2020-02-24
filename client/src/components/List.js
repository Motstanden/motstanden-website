import React from "react"

class List extends React.Component {
    render() {
        let list = this.props.itemSource.map( (item) => {
        return (<li key = {item.title} >{item.title}</li>)
        })

        return (
            <div>
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}

export default List