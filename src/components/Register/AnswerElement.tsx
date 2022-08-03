type AnswerElementProps = {
  type: string;
  function: Function;
  placeholder?: string;
  quesid?: number;
  options?: string[];
  value?: any;
}
export default function AnswerElement(props: AnswerElementProps) {

  if (props.type === "text") {
  
    return (
      <input type="text" className="w-full text-xl pb-1 border-b border-b-slate-300 focus:outline-none"
        placeholder={props.placeholder}
        onChange={
          (e) => {
            props.function(e.target.value);
          }}
        value={props.value}
      />
    );
  }

  if (props.type === "select") {
  
    return (
      <select className="w-full text-lg pb-1 border-b border-b-slate-300 focus:outline-none" onChange={
        (e) => {
          props.function(e.target.value);
        }}
        value={props.value}
        
      >
        {props.options?.map((option, index) => {
          return (
            <option key={index} value={option}>{option}</option>
          )
        }
        )}
      </select>
    )
  }

  if (props.type === "radio") {
  
    return (
      <div className="flex flex-col">
        {
          props.options?.map((option, index) => {
            return (
              <label className="w-full text-lg pb-1 focus:outline-none" key={index}>
                <input type="radio" name={"radiotype" + props.quesid} value={option} onChange={(e) => {
                  props.function(e.target.value);
                }
                }
                  checked={props.value === option}
                />
                &nbsp; {option}
              </label>
            )
          })
        }
      </div>
    )
  } 
  if (props.type === "none") {
    return (
      <></>
    )
  }else{
    return (
      <></>
    )
  }
}