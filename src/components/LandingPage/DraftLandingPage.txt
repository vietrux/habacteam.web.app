import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import useDocumentTitle from "../OtherFunc/useDocumentTitle";
type DraftLandingPageProps = {
  feed: {
    data: Array<{
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


export default function DraftLandingpage(props: DraftLandingPageProps) {
  useDocumentTitle("Trang chủ");
  return (
    <>
      <div className="overflow-y-auto h-screen ">
        <div className="ml-12 mt-32 sm:mt-8 ">
          <h1 className="text-2xl sm:text-4xl h-[48px] font-bold mb-[-8px] sm:mb-auto">New Feeds</h1>
          <p className='italic text-sm '>From /habacmediaclub</p>
        </div>
        <div className="mx-12 mb-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 sm:mt-12">
          {
            props.feed.data ? props.feed.data.map((item: any, index: number) => {
              return (
                <div className=" rounded-2xl shadow-xl shadow-gray-400" key={item.id}>
                  <img src={item.full_picture} alt="" className="rounded-t-2xl object-cover w-full aspect-square" />
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
                      {item.message || "[𝐍𝐞𝐰 𝐔𝐩𝐝𝐚𝐭𝐞]\nNo message\n#hmc\n#habacmediaclub\n\n"}
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
                <p className="text-sm">Không có bài viết nào</p>
              </div>
          }
          <div className='sm:hidden h-[10vh] text-center'>
            Không có bài viết nào
          </div>
        </div>

      </div>
    </>
  )
}