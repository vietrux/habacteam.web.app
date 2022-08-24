import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
type HRProps = {
  feed: {
    data: Array<{
      attactments?: object;
      message: string;
      permalink: string;
      full_picture: string;
      created_time: string;
      reactions: {
        data: Array<any>;
        paging: {
          cursor: {
            before: string;
            after: string;
          };
          next: string;
        }
        summary: {
          total_count: number;
        }
      }
      id: string;
    }>
  }
}

export default function HR(props: HRProps) {
  useDocumentTitle("Trang chủ");
  return (
    <>
      <div className="overflow-y-auto h-screen ">
        <div className="ml-12 mt-32 sm:mt-8 ">
          <h1 className="text-2xl sm:text-4xl h-[48px] font-bold mb-[-8px] sm:mb-auto">News Feed</h1>
          <p className='italic text-sm '>From /habac.radio</p>
        </div>
        <div className="mx-12 mb-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-12">
          {
            props.feed.data ? props.feed.data.map((item: any, index: number) => {
              console.log(item);
              return (
                <div className=" rounded-2xl shadow-xl shadow-gray-400" key={item.id}>
                  {
                    item.attachments?.data[0].media?.source ?
                      <video src={item.attachments.data[0].media.source} className="rounded-t-2xl object-cover w-full aspect-square" controls></video>
                      :
                      (
                        item.full_picture ?
                          <img src={item.full_picture} alt="" className="rounded-t-2xl object-cover w-full aspect-square" />
                      :
                          <img src="https://scontent.fhph3-1.fna.fbcdn.net/v/t1.6435-9/117528837_1974857756014484_7403788458473311156_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=N2kktbmVaboAX80hbsD&tn=IuAfZkdr7Ov_oScf&_nc_ht=scontent.fhph3-1.fna&oh=00_AT8QB6X2GnWBtPJ1etmTYY2JnVUUpESlCAZ8FPiGAl0ekQ&oe=6329AA38" alt="" className="rounded-t-2xl object-cover w-full aspect-square" />
                      )
                  }
                  <div className="p-2">
                    <p className="text-sm my-2">{item.created_time}</p>
                    <p style={
                      {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 5, /* number of lines to show */
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "pre-line"
                      }
                    }
                      className="text-sm italic "
                    >
                      {item.message? `${item.message}\n#hr\n#habacradio\n\n\n` : "[𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞]\nNo message\n#hr\n#habacradio\n\n"}
                      
                      
                    </p>
                    <div className="my-2 text-[red]">
                      <FontAwesomeIcon icon={solid("heart")} />
                      <span className="text-black"> {item.reactions.summary.total_count}</span>
                    </div>
                  </div>
                  <a href={item.permalink_url} className="w-full bg-pink-800 text-white block py-4 rounded-b-2xl text-center text-lg">Xem bài viết</a>
                </div>
              )
            })
              : <div className="text-center">
                <p className="text-sm">Loading...</p>
              </div>
          }
          <div className='sm:hidden h-[10vh] text-center'>
            {
              props.feed.data ? "Không còn bài viết nào" : null
            }
          </div>
        </div>
      </div>
    </>
  )
}