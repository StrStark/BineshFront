import svgPaths from "./svg-i452s7uw12";
import imgMoonAndStars from "figma:asset/27bb79d6090e7d398ac0df5f4fd148d65b24431d.png";
import imgTotalSales from "figma:asset/7c6c09893427e0655558b6434622276829f9f89a.png";
import imgReception from "figma:asset/337be8f80b3479816934a46ca3d67bec298f14ba.png";
import imgWarehouse from "figma:asset/8d8e689ad533c00931f10342942d54c033cc2c0b.png";
import imgExchange from "figma:asset/3dd8fdb3c3da761d8dbe3480a06a5fd018234b97.png";
import imgAi from "figma:asset/6f62077e9b36dda19277327710da8a31c9b1ed5f.png";
import imgPhUsers from "figma:asset/ec4b2713f645c5ebdfe7a539849fc1ddb00a4b6a.png";
import imgOnlineSupport from "figma:asset/b637dadff87b2053bdda5521caae88eaaae1be8c.png";
import imgImage184 from "figma:asset/1e6861f2f382aeb914eb3a74ad7733e812d514e1.png";
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="content-stretch flex items-start px-[2px] py-0 relative shrink-0">
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#181616] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="bg-white relative rounded-[256px] shrink-0 size-[32px]" data-name="Avatar">
      <div className="absolute bg-[#e6f3ff] left-[2px] rounded-[8px] size-[28px] top-[1.5px]" />
      <p className="absolute font-['Vazirmatn:Black',sans-serif] font-black leading-[20px] left-[16.5px] text-[#0085ff] text-[20px] text-center text-nowrap top-[2.5px] translate-x-[-50%]" dir="auto">
        م
      </p>
    </div>
  );
}

function AvatarOneLine() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Avatar+One Line">
      <Avatar />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[16px] text-nowrap" dir="auto">
        رامتین قیامی
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <AvatarOneLine />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame />
    </div>
  );
}

function Notifications() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[24px]" data-name="notifications">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="notifications">
          <path d={svgPaths.p2aa09100} fill="var(--stroke-0, #111111)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Counter() {
  return (
    <div className="[grid-area:1_/_1] bg-[#e92c2c] content-stretch flex items-center ml-[13px] mt-0 px-[4px] py-0 relative rounded-[96px]" data-name="Counter">
      <p className="font-['Dirooz_FD-WOL:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[10px] text-center text-nowrap text-white tracking-[0.4px] uppercase">2</p>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Notifications />
      <Counter />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="relative shrink-0 size-[29px]" data-name="Mask group">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none rotate-[180deg] scale-y-[-100%] size-[29px]">
          <div className="relative size-full" data-name="Moon and Stars">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgMoonAndStars} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#19243f] inset-[-6.9%_-6.9%_0_-10.34%]" />
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 size-[25px]">
      <div className="absolute inset-[-2%_0_0_-2%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.5 25.5">
          <g id="Frame 1261153573">
            <path d={svgPaths.p26412880} id="Line 329" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p38385340} id="Line 330" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p1ff6cd00} id="Line 331" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p3f627080} id="Line 332" stroke="var(--stroke-0, black)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0">
      <Frame2 />
      <Group />
      <MaskGroup />
      <Frame38 />
    </div>
  );
}

function TextState() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text State">
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#969696] text-[14px] text-nowrap" dir="auto">
        فرآیند یا عبارت مد نظر خود را وارد کنید
      </p>
    </div>
  );
}

function Search() {
  return (
    <div className="h-[18.215px] relative shrink-0 w-[18.207px]" data-name="search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2068 18.2151">
        <g id="search">
          <path clipRule="evenodd" d={svgPaths.pc021100} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[181px] top-[8px] w-[262px]">
      <TextState />
      <Search />
    </div>
  );
}

function Left() {
  return (
    <div className="absolute h-[40px] left-0 overflow-clip right-[32px] top-[calc(50%+0.5px)] translate-y-[-50%]" data-name="Left">
      <Frame36 />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="bg-[#f7f9fb] h-[40px] overflow-clip relative rounded-[8px] shrink-0 w-[475px]" data-name="Search Bar">
      <Left />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#130101] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          داشبورد
        </p>
      </div>
    </div>
  );
}

function IcRoundKeyboardArrowRight() {
  return (
    <div className="relative size-[20px]" data-name="ic:round-keyboard-arrow-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ic:round-keyboard-arrow-right">
          <path d={svgPaths.p4df0f00} fill="var(--fill-0, #111111)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame32 />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <IcRoundKeyboardArrowRight />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#1e0202] content-stretch flex flex-col items-start p-[7.879px] relative rounded-[5px] shrink-0">
      <div className="flex flex-col font-['Vazirmatn:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[14.182px] text-nowrap text-white uppercase">
        <p className="leading-[12.606px]" dir="auto">
          بینش
        </p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0">
      <Frame33 />
      <Frame3 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative shrink-0">
      <Frame23 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame24 />
      <SearchBar />
      <Frame25 />
    </div>
  );
}

function NavDashboard() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 overflow-clip px-[36px] py-[7px] top-0 w-[1248px]" data-name="Nav-Dashboard">
      <Frame34 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[20px]">
      <div className="bg-[#adadad] h-[2px] rounded-[2px] shrink-0 w-full" />
      <div className="bg-[#adadad] h-[2px] rounded-[2px] shrink-0 w-full" />
      <div className="bg-[#adadad] h-[2px] rounded-[2px] shrink-0 w-full" />
    </div>
  );
}

function Frame35() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%-15px)] px-[2px] py-0 top-0 translate-x-[-50%] w-[210px]">
      <Frame37 />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#969696] text-[12px] text-nowrap" dir="auto">
        منوی اصلی
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-[240px]">
      <Frame35 />
    </div>
  );
}

function MaterialSymbolsSpaceDashboardOutline() {
  return (
    <div className="h-[15px] relative shrink-0 w-[21px]" data-name="material-symbols:space-dashboard-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 15">
        <g id="material-symbols:space-dashboard-outline">
          <path d={svgPaths.p1e1a0f00} fill="var(--fill-0, #111111)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="داشبورد" />
      <MaterialSymbolsSpaceDashboardOutline />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#ebeef0] content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame4 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-center px-px py-0 relative shrink-0">
      <div className="relative shrink-0 size-[19px]" data-name="Total Sales">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgTotalSales} />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="فروش" />
      <Frame30 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame6 />
    </div>
  );
}

function FluentMdl2Shop() {
  return (
    <div className="h-[16px] relative w-[13px]" data-name="fluent-mdl2:shop">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 16">
        <g clipPath="url(#clip0_5_2871)" id="fluent-mdl2:shop">
          <path d={svgPaths.pc452000} fill="var(--fill-0, #111111)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_5_2871">
            <rect fill="white" height="16" width="13" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PhShoppingCart() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[4px] py-0 relative" data-name="ph:shopping-cart">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <FluentMdl2Shop />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="محصولات" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <PhShoppingCart />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="مشتریان" />
      <div className="relative shrink-0 size-[20px]" data-name="Reception">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgReception} />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame11 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="انبار" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="relative size-[22px]" data-name="Warehouse">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgWarehouse} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center pl-[8px] pr-[24px] py-[19px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame13 />
    </div>
  );
}

function MdiGraphBellCurveCumulative() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[4px] py-0 relative shrink-0" data-name="mdi:graph-bell-curve-cumulative">
      <div className="relative shrink-0 size-[19px]" data-name="Exchange">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgExchange} />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0">
      <Text text="مالی" />
      <MdiGraphBellCurveCumulative />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center pl-[8px] pr-[24px] py-[19px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-start px-[2px] py-0 relative shrink-0">
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#181616] text-[16px] text-nowrap text-right">
        <p className="leading-[normal]" dir="auto">
          هوض‌مصنوعی
        </p>
      </div>
    </div>
  );
}

function MdiGraphBellCurveCumulative1() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[3px] py-0 relative shrink-0" data-name="mdi:graph-bell-curve-cumulative">
      <div className="relative shrink-0 size-[20px]" data-name="AI">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgAi} />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0">
      <Frame15 />
      <MdiGraphBellCurveCumulative1 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center pl-[8px] pr-[24px] py-[19px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame16 />
    </div>
  );
}

function DashboardTabs() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end justify-center relative shrink-0" data-name="Dashboard-tabs">
      <Frame5 />
      <Frame7 />
      <Frame29 />
      <Frame8 />
      <Frame9 />
      <Frame28 />
      <Frame27 />
    </div>
  );
}

function DashboardMainmenu() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] items-start left-[24px] top-[122px]" data-name="Dashboard-mainmenu">
      <Frame1 />
      <DashboardTabs />
    </div>
  );
}

function PhUsers() {
  return (
    <div className="h-[26px] relative shrink-0 w-[25px]" data-name="ph:users">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-full left-[2%] max-w-none top-0 w-[104%]" src={imgPhUsers} />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="آموزش‌ها" />
      <PhUsers />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame17 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text text="پشتیبانی" />
      <div className="relative shrink-0 size-[23px]" data-name="Online Support">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgOnlineSupport} />
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame19 />
    </div>
  );
}

function IonSettingsOutline() {
  return <div className="h-[16.719px] shrink-0 w-[16.251px]" data-name="ion:settings-outline" />;
}

function Frame31() {
  return (
    <div className="h-[16.719px] relative shrink-0 w-[24.251px]">
      <div className="absolute inset-[-3.74%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.2511 17.969">
          <g id="Frame 427319097">
            <path d={svgPaths.p18237900} id="Vector" stroke="var(--stroke-0, #111111)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center relative shrink-0">
      <IonSettingsOutline />
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#181616] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          تنظیمات
        </p>
      </div>
      <Frame31 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame21 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame18 />
      <Frame20 />
      <Frame22 />
    </div>
  );
}

function DashboardMoreSettings() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0" data-name="Dashboard-more settings">
      <Frame12 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col h-[189px] items-center justify-center left-0 p-[8px] w-[264px]">
      <DashboardMoreSettings />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] not-italic place-items-start relative shrink-0 text-right">
      <p className="[grid-area:1_/_1] font-['Yekan_Bakh_FaNum:SemiBold',sans-serif] h-[21px] leading-[20px] ml-[155.18px] mt-0 relative text-[#1c1c1c] text-[18px] tracking-[-0.9px] translate-x-[-100%] w-[155.181px]" dir="auto">
        پـنـل بـیـنـش
      </p>
      <p className="[grid-area:1_/_1] font-['Yekan_Bakh_FaNum:Light',sans-serif] leading-[normal] ml-[160.82px] mt-[19.25px] relative text-[10px] text-black text-nowrap translate-x-[-100%]" dir="auto">
        سیستم هوشمند مدیریت داده‌ها
      </p>
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="h-[46.659px] relative shrink-0 w-[41px]" data-name="Mask group">
      <div className="absolute inset-[-1.07%_-1.22%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41.9999 47.6586">
          <g id="Mask group">
            <mask height="48" id="mask0_5_2861" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="42" x="0" y="0">
              <g id="Vector 25">
                <path d={svgPaths.p11bd900} fill="var(--fill-0, #A1A1A1)" />
                <path d={svgPaths.p34985d00} fill="var(--fill-0, #A1A1A1)" />
                <path d={svgPaths.p1e2d4900} fill="var(--fill-0, #A1A1A1)" />
                <path d={svgPaths.p1316ff80} fill="var(--fill-0, #A1A1A1)" />
                <path d={svgPaths.p11bd900} stroke="var(--stroke-0, black)" />
                <path d={svgPaths.p34985d00} stroke="var(--stroke-0, black)" />
                <path d={svgPaths.p1e2d4900} stroke="var(--stroke-0, black)" />
                <path d={svgPaths.p1316ff80} stroke="var(--stroke-0, black)" />
              </g>
            </mask>
            <g mask="url(#mask0_5_2861)">
              <rect fill="url(#paint0_linear_5_2861)" height="65.4353" id="Rectangle 34624143" width="60.4968" x="0.5" y="-4.74716" />
              <path d={svgPaths.p264b3b80} fill="url(#paint1_linear_5_2861)" id="Rectangle 34624148" />
              <path d={svgPaths.p3e8af400} fill="url(#paint2_linear_5_2861)" id="Rectangle 34624147" />
              <path d={svgPaths.p2317d700} fill="var(--fill-0, #92A2C4)" id="Rectangle 34624146" />
              <rect fill="url(#paint3_linear_5_2861)" height="8.53951" id="Rectangle 34624144" width="24.3839" x="13.4635" y="12.7434" />
            </g>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_2861" x1="31.9316" x2="4.15244" y1="-3.46109" y2="44.1235">
              <stop stopColor="#5F758D" />
              <stop offset="0.263833" stopColor="#93A4C2" />
              <stop offset="0.695244" stopColor="#65A2CF" />
              <stop offset="1" stopColor="#93A4C2" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_5_2861" x1="21.9517" x2="21.9517" y1="25.6041" y2="37.9504">
              <stop stopColor="#93A3BA" />
              <stop offset="1" stopColor="#6FA2CC" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_5_2861" x1="25.0897" x2="2.40337" y1="1.01442" y2="10.4285">
              <stop stopColor="#6F809A" stopOpacity="0" />
              <stop offset="0.475962" stopColor="#64758F" />
              <stop offset="1" stopColor="#252B34" stopOpacity="0" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_5_2861" x1="37.1272" x2="19.2765" y1="16.9617" y2="18.505">
              <stop stopColor="#899BB7" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute bg-white h-[1000px] left-[1248px] overflow-clip shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] top-0 w-[264px]" data-name="Component 3">
      <div className="absolute bg-gradient-to-r from-[#eff6ff] h-[71px] left-0 to-[#eef2ff] top-0 via-[#eef4ff] via-[48.558%] w-[264px]" />
      <DashboardMainmenu />
      <Frame26 />
      <div className="absolute h-0 left-[26px] top-[822px] w-[212px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 212 1">
            <line id="Line 336" stroke="var(--stroke-0, #9D9D9D)" x2="212" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[calc(50%-147.5px)] top-[497px] translate-x-[-50%]">
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] left-[calc(50%-127px)] not-italic text-[20px] text-black text-center text-nowrap top-[497px] translate-x-[-50%]" dir="auto">
        افزودن و حذف
      </p>
      <div className="absolute h-[4px] left-[526px] top-[511px] w-[10px]">
        <div className="absolute inset-[-10.11%_-2.94%_8.66%_-3.32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6263 4.05792">
            <path d={svgPaths.pb417d00} id="Line 338" stroke="var(--stroke-0, black)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[calc(50%-131.5px)] top-[490px] translate-x-[-50%]">
      <div className="absolute bg-white h-[38px] left-[480px] rounded-tl-[20px] rounded-tr-[20px] top-[490px] w-[289px]" />
      <Group3 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f7f9fb] relative size-full" data-name="داشبورد">
      <div className="absolute h-[531px] left-[820px] top-[86px] w-[410px]" data-name="image 184">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage184} />
      </div>
      <div className="absolute bg-[rgba(0,0,0,0.15)] h-[1234px] left-[-36px] top-0 w-[1548px]" />
      <NavDashboard />
      <div className="absolute bg-white h-[493px] left-[-17px] top-[522px] w-[1284px]" />
      <Component1 />
      <Group2 />
      <div className="absolute bg-[#f2f2f2] h-[201px] left-[906px] rounded-[10px] top-[580px] w-[261px]" />
      <div className="absolute bg-[#f2f2f2] h-[154px] left-[906px] rounded-[10px] top-[792px] w-[261px]" />
      <div className="absolute bg-[#f2f2f2] h-[366px] left-[605px] rounded-[10px] top-[580px] w-[283px]" />
      <div className="absolute bg-[#f2f2f2] h-[115px] left-[46px] rounded-[10px] top-[580px] w-[541px]" />
      <div className="absolute bg-[#f2f2f2] h-[239px] left-[46px] rounded-[10px] top-[707px] w-[541px]" />
    </div>
  );
}