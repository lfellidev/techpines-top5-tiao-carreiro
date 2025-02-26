import React from "react"

type Props = {
    children: React.ReactNode
}

const Container: React.FC<Props> = (props) => (
    <section>
        <article className="myContainer">
            {props.children}
        </article>
    </section>
)

export default Container