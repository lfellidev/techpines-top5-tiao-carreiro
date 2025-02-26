import React from 'react'

type Props = {
  type?: 'link' | 'card' | 'add' | 'trash' | 'approve' | 'pagination' | 'edit';
  label?: string
  onClick?: () => void
  opacity?: string
  alt?: string
	approved?: string
	disabled?: boolean
	size?: number | undefined
}

const Button: React.FC<Props> = (props) => {
  const typeProps = props.type;
	const approvedProps = props.approved;
	const sizeProps = props.size;
  	if (typeProps == "add") {
			return (
      	<button className='buttonNone' onClick={props.onClick}>
        	<img 
          	src="/add.svg" 
          	className="fluid-img" 
          	width={36} 
          	height={36} 
          	alt={props.alt || "adicionar"} 
        	/>
      	</button>
    	);
  	} else if (typeProps == "trash") {
      return (
        <button 
					className='buttonIcon' 
					onClick={props.onClick}
				>
          <img
		  			src="/trash.svg"
		  			width={sizeProps || 24} 
						height={sizeProps || 24} 
						alt={props.alt || "apagar"} 
						style={{ opacity: props.opacity || 1 }}
					/>
        </button>
      );
		} else if (typeProps == "edit") {
			return (
				<button className='buttonIcon' onClick={props.onClick}>
				<img 
					src="/edit.svg"
					width={sizeProps || 24} 
					height={sizeProps || 24} 
					alt={props.alt || "aprovar"} 
					style={{ opacity: props.opacity || 1 }}
				/>
				</button>
			);	
		} else if (typeProps == "approve") {
		return (
		  <button className='buttonIcon' onClick={props.onClick}>
			<img 
				src={approvedProps=="1"?"/approve.svg":"/disapproved.svg"}
				width={sizeProps || 24} 
				height={sizeProps || 24} 
				alt={props.alt || "aprovar"} 
				style={{ opacity: props.opacity || 1 }}
			/>
		  </button>
		);
  } else if (typeProps == "pagination" ) {
		if (props.disabled) {
			return(
				<button className='buttonPaginationDisabled' disabled={true}>
				{props.label}
			</button>
			);
		} else{
			return (
				<button className='buttonPagination' onClick={props.onClick}>
					{props.label}
				</button>
			);
		}
	} else {
    return (
      <button
        className={
          typeProps === "link" ? "buttonLink" : 
          typeProps === "card" ? "buttonCard" :
          "btn myPrimaryButton"
        }
        onClick={props.onClick}
      >
        {props.label}
      </button>
    )
  }
}
export default Button
