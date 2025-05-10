"use client";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";
import Loading from "@/app/vendor/loading";
import { useTranslations } from "next-intl";
import { debounce } from "lodash";
import Select from "react-select";
import { formatNumber } from "@/lib/utils/constants";
import CreatorCard from "@/app/_components/components-common/creator/creator-card";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import CollaborateRequest from "@/app/_components/components-common/dialogs/collaborate-creator-form";
import { SearchInput } from "@/app/_components/components-common/search-field";
export interface ICategory {
  _id: string;
  name: string;
}

export interface IChannel {
  _id: string;
  creatorId: string;
  channelId: string;
  channelName: string;
  handleName: string;
  token: string;
  channelType: string;
  createdAt: string;
  updatedAt: string;
  lastFiveVideoViews: number;
  lastMonthViews: number;
}
export interface ICreator {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sub_category: string[];
  category: ICategory[];
  channels: IChannel[];
  categories?: string;
  tag?: string;
  instagramViews?: string;
  youtubeViews?: string;
  pastSales?: string;
}
const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    width: "200px",
    borderRadius: "8px",
  }),
};

export default function CreatorList() {
  const translate = useTranslations();
  const [loading, setLoading] = useState<boolean>(true);
  const [internalLoader, setInternalLoader] = useState<boolean>(false);
  const [creators, setCreators] = useState<ICreator[]>([]);
  const [filter, setFilter] = useState<string>("5");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const initialValue = { show: false, creatorId: "" };
  const [isOpen, setIsOpen] = useState(initialValue);
  const [pageSize] = useState(20);
  const filterOption = [
    { value: "5", label: "Last 5 Videos" },
    { value: "30", label: "Last 1 Month" },
  ];

  const getInstagramView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let instagram = channels.find(
      (ele: { channelType: string }) => ele.channelType === "instagram"
    );
    return "";
  };
  const getYoutubeView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let youtube = channels.find(
      (ele: { channelType: string }) => ele.channelType === "youtube"
    );
    return youtube
      ? formatNumber(
          filter === "5" ? youtube?.lastFiveVideoViews : youtube?.lastMonthViews
        )
      : "-";
  };
  // Get Creator list
  const getCreatorList = useCallback(
    async (
      page: number,
      isInternalLoader?: boolean,
      searchValue: string = ""
    ) => {
      isInternalLoader ? setInternalLoader(true) : setLoading(true);
      try {
        // const response = await axios.get(
        //   `/auth/creator/list?page=${page}&limit=${pageSize}${
        //     searchValue ? `&search=${searchValue}` : ""
        //   }`
        // );
        let response = {
          status: 200,
          data: {
            data: {
              list: [
                {
                  _id: "67f93c787638180ae9052b9a",
                  accountId: "67f93c027638180ae9052b8c",
                  full_name: "Creator",
                  user_name: "Creator_Kunjesh",
                  phone: "9054963456",
                  title: "Men’s Style Guide & Trends",
                  long_description:
                    "I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!",
                  short_description:
                    "Helping men stay stylish with the latest fashion trends.",
                  tags: ["Men’s Style"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                  ],
                  sub_category: ["67db0a522d3f810c558818ab"],
                  profile_image: "",
                  banner_image: "",
                  channels: [],
                  completed: 25,
                  createdAt: "2025-04-11T15:59:52.742Z",
                  updatedAt: "2025-04-11T15:59:52.742Z",
                },
                {
                  _id: "67f93ce61ec0fa4376524b97",
                  accountId: "67f93c3f1ec0fa4376524b87",
                  full_name: "the_rock1",
                  user_name: "the_user_rock1",
                  phone: "90145643657",
                  title: "my profile title1",
                  long_description: "this is long destiription1",
                  short_description: "this is short description1",
                  tags: ["meanswere1"],
                  category: [],
                  sub_category: ["67d0893a8574df475ee9a632"],
                  profile_image: "",
                  banner_image: "",
                  channels: [
                    {
                      _id: "67f93cf6cd459196130d6423",
                      creatorId: "67f93ce61ec0fa4376524b97",
                      channelId: "UCM3VUcB79daECIUz2iAaL_A",
                      channelName: "prashanth",
                      handleName: "prashanth",
                      channelType: "youtube",
                      createdAt: "2025-04-11T16:01:58.836Z",
                      updatedAt: "2025-04-24T19:30:03.968Z",
                      lastFiveVideoViews: 1,
                      lastMonthViews: 1,
                    },
                  ],
                  completed: 50,
                  createdAt: "2025-04-11T16:01:42.697Z",
                  updatedAt: "2025-04-12T18:20:08.287Z",
                },
                {
                  _id: "67f93d8f99102071a1a602d4",
                  accountId: "67f93d5799102071a1a602c4",
                  full_name: "Brady Poole cylal_yash",
                  user_name: "cylal_yash",
                  phone: "9558122322",
                  title: "Incidunt cillum iur",
                  long_description: "Voluptate est suscip",
                  short_description: "Et incidunt dolorem",
                  tags: ["Magna aut at lorem q"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                    {
                      _id: "67db0a2c2d3f810c5588189d",
                      name: "category 2",
                    },
                  ],
                  sub_category: ["67db0a5c2d3f810c558818ae"],
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67f93d5799102071a1a602c4/1744652043161.JPG",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67f93d5799102071a1a602c4/1744572562509.JPG",
                  channels: [],
                  completed: 25,
                  createdAt: "2025-04-11T16:04:31.137Z",
                  updatedAt: "2025-04-14T17:34:43.471Z",
                },
                {
                  _id: "67f9607199102071a1a60375",
                  accountId: "67f9603099102071a1a60367",
                  full_name: "Sonya Vazquez",
                  user_name: "vowyhog",
                  phone: "9558422122",
                  title: "Consequatur aliqua ",
                  long_description: "Ex cum amet rerum i",
                  short_description: "Reprehenderit tempor",
                  tags: ["In sit id blanditii"],
                  category: [
                    {
                      _id: "67db0a322d3f810c558818a3",
                      name: "category 4",
                    },
                  ],
                  sub_category: ["67db0a412d3f810c558818a6"],
                  profile_image: "",
                  banner_image: "",
                  channels: [],
                  completed: 25,
                  createdAt: "2025-04-11T18:33:21.724Z",
                  updatedAt: "2025-04-11T18:33:21.724Z",
                },
                {
                  _id: "67fbeb68c024ece1a1fb51b1",
                  accountId: "67fbeb17c024ece1a1fb51a3",
                  full_name: "test",
                  user_name: "test_01",
                  phone: "90145643657",
                  title: "my profile title1",
                  long_description: "this is long destiription1",
                  short_description: "this is short description1",
                  tags: ["meanswere11"],
                  category: [],
                  sub_category: ["67d0893a8574df475ee9a632"],
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fbeb17c024ece1a1fb51a3/1744566440287.jpeg",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fbeb17c024ece1a1fb51a3/1744566521422.jpeg",
                  channels: [
                    {
                      _id: "67fbeb76ae061cb31e8a946c",
                      creatorId: "67fbeb68c024ece1a1fb51b1",
                      channelId: "UC49Il2IigICrSaXsXnGpArA",
                      channelName: "AKSHAY BVM",
                      handleName: "AKSHAY BVM",
                      channelType: "youtube",
                      createdAt: "2025-04-13T16:51:02.842Z",
                      updatedAt: "2025-04-24T19:30:03.047Z",
                      lastFiveVideoViews: 4,
                      lastMonthViews: 4,
                    },
                  ],
                  completed: 50,
                  createdAt: "2025-04-13T16:50:48.804Z",
                  updatedAt: "2025-04-13T17:48:43.622Z",
                },
                {
                  _id: "67fd49ebcfe771ed91c28c2b",
                  accountId: "67fd481fcfe771ed91c28bf0",
                  full_name: "Alexander Osborne",
                  user_name: "kahoq",
                  phone: "7412589633",
                  title: "Vel eaque iusto rati",
                  long_description: "Dolorem dignissimos ",
                  short_description: "Adipisicing ut numqu",
                  tags: ["Quibusdam consequatu", "ttttttt"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                    {
                      _id: "67db0a2c2d3f810c5588189d",
                      name: "category 2",
                    },
                  ],
                  sub_category: [
                    "67db0a522d3f810c558818ab",
                    "67db0a5c2d3f810c558818ae",
                  ],
                  channels: [],
                  completed: 25,
                  createdAt: "2025-04-14T17:46:19.723Z",
                  updatedAt: "2025-04-14T19:02:46.159Z",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fd49ebcfe771ed91c28c2b/1744652781887.webp",
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fd49ebcfe771ed91c28c2b/1744652779825.webp",
                },
                {
                  _id: "67fd6d3ab8f800fa8b722151",
                  accountId: "67fd6b56b8f800fa8b72213b",
                  full_name: "creator.youtube",
                  user_name: "creator.youtube",
                  phone: "9876543215",
                  title: "creator.youtube title",
                  long_description: "creator.youtube long dwesxcasfcsdc",
                  short_description: "azsdcascfsdcvdsvdsv",
                  tags: ["mens"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                  ],
                  sub_category: ["67db0a522d3f810c558818ab"],
                  channels: [
                    {
                      _id: "67fd6da43a7df4bbea863521",
                      creatorId: "67fd6d3ab8f800fa8b722151",
                      channelId: "UCM3VUcB79daECIUz2iAaL_A",
                      channelName: "prashanth",
                      handleName: "prashanth",
                      channelType: "youtube",
                      createdAt: "2025-04-14T20:18:44.667Z",
                      updatedAt: "2025-04-14T20:18:44.667Z",
                    },
                  ],
                  completed: 50,
                  createdAt: "2025-04-14T20:16:58.519Z",
                  updatedAt: "2025-04-14T20:18:49.345Z",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fd6d3ab8f800fa8b722151/1744661821123.jpg",
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fd6d3ab8f800fa8b722151/1744661818574.jpg",
                },
                {
                  _id: "67fddb02b8f800fa8b7221a0",
                  accountId: "67fdda10b8f800fa8b722195",
                  full_name: "Test Creator",
                  user_name: "test_creator",
                  phone: "6549873215",
                  title: "Test Creator Title",
                  long_description: "Test Creator ",
                  short_description: "Test Creator ",
                  tags: ["Test", "Creator", "Title", "Fashion"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                    {
                      _id: "67db0a2f2d3f810c558818a0",
                      name: "category 3",
                    },
                  ],
                  sub_category: [
                    "67db0a722d3f810c558818b4",
                    "67db0a522d3f810c558818ab",
                  ],
                  channels: [
                    {
                      _id: "67fddb183a7df4bbea863530",
                      creatorId: "67fddb02b8f800fa8b7221a0",
                      channelId: "UCAt9t9IsvwlXahHFevuL36A",
                      channelName: "Developer Life1702",
                      handleName: "Developer Life1702",
                      channelType: "youtube",
                      createdAt: "2025-04-15T04:05:44.303Z",
                      updatedAt: "2025-04-24T19:30:04.485Z",
                      lastFiveVideoViews: 0,
                      lastMonthViews: 0,
                    },
                  ],
                  completed: 50,
                  createdAt: "2025-04-15T04:05:22.126Z",
                  updatedAt: "2025-04-21T05:00:12.444Z",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fdda10b8f800fa8b722195/1745084409005.webp",
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fdda10b8f800fa8b722195/1745084408779.webp",
                },
                {
                  _id: "67fe8aa35dffd612bcfd23f5",
                  accountId: "67fe87045dffd612bcfd23a8",
                  full_name: "Rhiannon Peters",
                  user_name: "fisonecyko",
                  phone: "7788996655",
                  title: "Cupidatat sit facil",
                  long_description: "Dolores consequatur",
                  short_description: "Aut illum enim accu",
                  tags: ["Nisi excepturi autem"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                    {
                      _id: "67db0a2c2d3f810c5588189d",
                      name: "category 2",
                    },
                  ],
                  sub_category: [
                    "67db0a522d3f810c558818ab",
                    "67db0a5c2d3f810c558818ae",
                  ],
                  channels: [],
                  completed: 25,
                  createdAt: "2025-04-15T16:34:43.740Z",
                  updatedAt: "2025-04-15T16:34:46.830Z",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fe8aa35dffd612bcfd23f5/1744734885940.webp",
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fe8aa35dffd612bcfd23f5/1744734883934.webp",
                },
                {
                  _id: "67fe92b461e3f264a457a0b8",
                  accountId: "67fe888a61e3f264a457a09d",
                  full_name: "Luna Luxe",
                  user_name: "Luna_Luxe ",
                  phone: "9054961111",
                  title: "Luna Luxe ",
                  long_description:
                    "Lila Lamar (for a playful and whimsical tone)",
                  short_description: "luxurious and creative vibe",
                  tags: ["luxurious and creative vibe"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                  ],
                  sub_category: ["67db0a522d3f810c558818ab"],
                  channels: [],
                  completed: 25,
                  createdAt: "2025-04-15T17:09:08.489Z",
                  updatedAt: "2025-04-15T17:09:13.186Z",
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/67fe92b461e3f264a457a0b8/1744736948571.png",
                },
                {
                  _id: "68093474beb8486878e9d931",
                  accountId: "68093380beb8486878e9d925",
                  full_name: "Test New Creator",
                  user_name: "test_new_creator",
                  phone: "3216549875",
                  title: "asfdsfsdfsdf",
                  long_description: "dsfsdfdsfsdfsdf",
                  short_description: "sdfsdfsdfsdf",
                  tags: ["hello", "test"],
                  category: [
                    {
                      _id: "67db0a252d3f810c5588189a",
                      name: "category 1",
                    },
                  ],
                  sub_category: ["67db0a522d3f810c558818ab"],
                  channels: [],
                  completed: 50,
                  createdAt: "2025-04-23T18:41:56.954Z",
                  updatedAt: "2025-04-23T18:41:59.363Z",
                  banner_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/68093474beb8486878e9d931/1745433718973.jpg",
                  profile_image:
                    "https://truereff-bucket.s3.eu-north-1.amazonaws.com/creator/68093474beb8486878e9d931/1745433716993.jpg",
                },
              ],
              count: 11,
            },
          },
        };
        if (response.status === 200) {
          const creatorData = response.data.data;
          if (creatorData && typeof creatorData === "object") {
            const creatorsArray = creatorData.list || [];
            const creatorsCount = creatorData.count || 0;

            if (Array.isArray(creatorsArray)) {
              let result = creatorsArray.map((ele: any) => {
                ele.categories = ele.category
                  ?.map((ele: { name: string }) => ele?.name)
                  .join(",");
                ele.tag = ele.tags?.join(",");
                ele.instagramViews = getInstagramView(ele.channels);
                ele.youtubeViews = getYoutubeView(ele.channels);
                //@ts-ignore
                ele.pastSales = ele?.pastSales || "";
                return { ...ele };
              });
              setCreators([...result]);
              setTotalPages(Math.ceil(creatorsCount / pageSize));
            } else {
              setCreators([]);
              setCurrentPage(1);
            }
            setLoading(false);
            setInternalLoader(false);
          } else {
            setCreators([]);
            setCurrentPage(1);
            setLoading(false);
            setInternalLoader(false);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
        setInternalLoader(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    getCreatorList(currentPage);
  }, []);
  const handlePageChange = (page: number) => {
    page !== currentPage && getCreatorList(page, true, search);
  };
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      getCreatorList(1, true, value);
    }, 500),
    []
  );
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    debouncedSearch(value);
    setSearch(value);
  };
  const handleFilterValue = (value: any) => {
    setFilter(value?.value);
  };
  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between items-center  gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={translate("Search_creator")}
            />
            <div className="flex items-center gap-[10px]">
              <Select
                styles={customStyles}
                value={[
                  {
                    value: filter,
                    label: filter
                      ? filterOption.find((ele) => ele?.value === filter)?.label
                      : "Select Status",
                  },
                ]}
                onChange={handleFilterValue}
                options={filterOption}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder="Select Status"
              />
            </div>
          </div>
          {creators?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 p-2 md:p-4 bg-white rounded-[20px]  overflow-auto">
                {creators.map((item: any, i) => (
                  <div key={i} className="flex h-full w-full">
                    <CreatorCard
                      item={item}
                      handleCollaborateNow={(creatorId: string) => {
                        setIsOpen({ show: true, creatorId });
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <TablePagination
                  totalPages={totalPages}
                  activePage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <EmptyPlaceHolder
              title={translate("No_Creators_Available_Title")}
              description={translate("No_Creators_Available_Description")}
            />
          )}
        </>
      )}
      {isOpen?.show && (
        <CollaborateRequest
          open={isOpen?.show}
          onClose={() => {
            setIsOpen(initialValue);
          }}
          creatorId={isOpen?.creatorId}
        />
      )}
    </div>
  );
}
