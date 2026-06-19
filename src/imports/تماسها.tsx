import svgPaths from "./svg-0ryzetymx9";
import clsx from "clsx";
import imgMoonAndStars from "figma:asset/27bb79d6090e7d398ac0df5f4fd148d65b24431d.png";
import imgRectangle34624107 from "figma:asset/debc5406364478d3518f2b01aa63a730f00941f8.png";
import imgRectangle34624162 from "figma:asset/b65c521ef9a3ceda9c452f054252d817f1c343b8.png";
import imgCloudStorage from "figma:asset/86014ca0306527d893efaeb962a6fcfce989b611.png";
import imgDatabaseAdministrator from "figma:asset/f2329e86805e3415f0fc9f8a622d57e7635286a7.png";
import imgPhUsers from "figma:asset/ec4b2713f645c5ebdfe7a539849fc1ddb00a4b6a.png";
import imgOnlineSupport from "figma:asset/b637dadff87b2053bdda5521caae88eaaae1be8c.png";
import imgRectangle34624161 from "figma:asset/14816dda0b501dd34d1320469bee30ea984b767b.png";
type Button7Props = {
  additionalClassNames?: string;
};

function Button7({ children, additionalClassNames = "" }: React.PropsWithChildren<Button7Props>) {
  return (
    <div className={clsx("bg-white relative rounded-[8px] shrink-0", additionalClassNames)}>
      <div className="content-stretch flex flex-col items-center overflow-clip p-[10px] relative rounded-[inherit]">{children}</div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function Wrapper10({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[4.264px] relative shrink-0 w-[6.667px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 4.26387">
        {children}
      </svg>
    </div>
  );
}
type Wrapper9Props = {
  additionalClassNames?: string;
};

function Wrapper9({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper9Props>) {
  return (
    <div className={additionalClassNames}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}
type Wrapper8Props = {
  additionalClassNames?: string;
};

function Wrapper8({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper8Props>) {
  return <Wrapper9 additionalClassNames={clsx("[grid-area:1_/_1] relative size-[24px]", additionalClassNames)}>{children}</Wrapper9>;
}

function Wrapper7({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}
type Wrapper6Props = {
  additionalClassNames?: string;
};

function Wrapper6({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper6Props>) {
  return (
    <div className={clsx("relative size-[20px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        {children}
      </svg>
    </div>
  );
}

function Icon1({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper6 additionalClassNames="shrink-0">
      <g id="Icon">{children}</g>
    </Wrapper6>
  );
}

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text6 text="0" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">{children}</div>
      </div>
      <Text4 text="0" />
    </div>
  );
}

function Wrapper4({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] flex items-center justify-center ml-0 mt-0 relative w-[1114px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">{children}</div>
      </div>
      <Helper1 />
    </div>
  );
}

function Wrapper3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] flex h-[40px] items-center justify-center ml-0 mt-0 relative w-[1114px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">{children}</div>
      </div>
      <Helper1 />
    </div>
  );
}
type Frame11HelperProps = {
  additionalClassNames?: string;
};

function Frame11Helper({ children, additionalClassNames = "" }: React.PropsWithChildren<Frame11HelperProps>) {
  return (
    <div className={clsx("absolute flex h-[232.5px] items-center justify-center left-[87px] w-[902px]", additionalClassNames)}>
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <div className="h-[232.5px] relative w-[902px]">{children}</div>
      </div>
    </div>
  );
}
type Text15Props = {
  text: string;
  additionalClassNames?: string;
};

function Text15({ text, children, additionalClassNames = "" }: React.PropsWithChildren<Text15Props>) {
  return (
    <div className={clsx("absolute content-stretch flex gap-[8px] items-center", additionalClassNames)}>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-nowrap" dir="auto">
        {text}
      </p>
      <Wrapper7>{children}</Wrapper7>
    </div>
  );
}
type Text14Props = {
  text: string;
};

function Text14({ text, children }: React.PropsWithChildren<Text14Props>) {
  return (
    <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-[4px] relative rounded-[inherit]">
      <div className="flex items-center justify-center leading-[0] relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">{children}</div>
      </div>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-center text-nowrap" dir="auto">
        {text}
      </p>
    </div>
  );
}
type ComponentHelperProps = {
  additionalClassNames?: string;
};

function ComponentHelper({ children, additionalClassNames = "" }: React.PropsWithChildren<ComponentHelperProps>) {
  return (
    <div className={additionalClassNames}>
      <div className="absolute inset-[-6.02%_-0.47%_-5.27%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102.903 18.4885">
          {children}
        </svg>
      </div>
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[46px] relative shrink-0 w-[48px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 46">
        <g id="Group 38">{children}</g>
      </svg>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <Wrapper9 additionalClassNames={clsx("relative size-[24px]", additionalClassNames)}>
      <g id="Small Arrow Up">{children}</g>
    </Wrapper9>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-px relative w-[968.232px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 968.232 1">
        <g id="Horizontal">{children}</g>
      </svg>
    </div>
  );
}

function PhUsers() {
  return (
    <div className="h-[12.352px] relative shrink-0 w-[22.903px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.9031 12.3519">
        <g clipPath="url(#clip0_1_1755)" id="ph:users">
          <path d={svgPaths.p13488400} fill="var(--fill-0, #111111)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1755">
            <rect fill="white" height="12.3519" width="22.9031" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
type Text13Props = {
  text: string;
};

function Text13({ text }: Text13Props) {
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
type ButtonText1Props = {
  text: string;
};

function ButtonText1({ text }: ButtonText1Props) {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0">
      <div className="content-stretch flex flex-col items-center overflow-clip px-[12px] py-[8px] relative rounded-[inherit]">
        <p className="font-['Vazir_FD:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1c1c1c] text-[16px] text-center text-nowrap">{text}</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}
type Text12Props = {
  text: string;
  additionalClassNames?: string;
};

function Text12({ text, additionalClassNames = "" }: Text12Props) {
  return (
    <div className={additionalClassNames}>
      <Icon />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#364153] text-[14px] text-nowrap" dir="auto">
        {text}
      </p>
    </div>
  );
}
type Text11Props = {
  text: string;
  additionalClassNames?: string;
};

function Text11({ text, additionalClassNames = "" }: Text11Props) {
  return <Text12 text={text} additionalClassNames={clsx("content-stretch flex gap-[10px] items-center justify-center relative", additionalClassNames)} />;
}
type Text10Props = {
  text: string;
  additionalClassNames?: string;
};

function Text10({ text, additionalClassNames = "" }: Text10Props) {
  return <Text12 text={text} additionalClassNames={clsx("content-stretch flex gap-[10px] items-center justify-center px-[16px] py-0 relative shrink-0", additionalClassNames)} />;
}

function Icon() {
  return (
    <Wrapper10>
      <path clipRule="evenodd" d={svgPaths.pb341300} fill="var(--fill-0, #364153)" fillRule="evenodd" id="Icon" />
    </Wrapper10>
  );
}
type HeaderTextTextProps = {
  text: string;
};

function HeaderTextText({ text }: HeaderTextTextProps) {
  return (
    <div className="content-stretch flex gap-[10px] h-[20px] items-center justify-center relative shrink-0">
      <Icon />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#364153] text-[14px] text-center text-nowrap" dir="auto">
        {text}
      </p>
    </div>
  );
}
type Horizontal2Props = {
  additionalClassNames?: string;
};

function Horizontal2({ additionalClassNames = "" }: Horizontal2Props) {
  return (
    <div className={clsx("absolute h-px left-0 w-[1180px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1180 1">
        <g id="Horizontal">
          <path d="M0 0.5H1180" id="Line" stroke="var(--stroke-0, #E8E8E8)" />
        </g>
      </svg>
    </div>
  );
}
type Text9Props = {
  text: string;
};

function Text9({ text }: Text9Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#197910] text-[16px] text-center w-[146px]" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text8Props = {
  text: string;
};

function Text8({ text }: Text8Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#4f4f4f] text-[16px] text-center text-nowrap" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text7Props = {
  text: string;
};

function Text7({ text }: Text7Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] text-nowrap" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text6Props = {
  text: string;
};

function Text6({ text }: Text6Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] w-[87px]" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text5Props = {
  text: string;
};

function Text5({ text }: Text5Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#e74c3c] text-[16px] text-center text-nowrap" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}

function Helper1() {
  return (
    <div className="[grid-area:1_/_1] h-0 ml-[53.84px] mt-[40px] relative w-[1034.281px]">
      <div className="absolute inset-[-1px_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1034.28 1">
          <line id="Line 280" stroke="var(--stroke-0, #E8E8E8)" x2="1034.28" y1="0.5" y2="0.5" />
        </svg>
      </div>
    </div>
  );
}
type Text4Props = {
  text: string;
};

function Text4({ text }: Text4Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] text-center w-[146px]" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text3Props = {
  text: string;
};

function Text3({ text }: Text3Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] text-center text-nowrap" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text2Props = {
  text: string;
};

function Text2({ text }: Text2Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] text-center w-[102px]" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] w-[141px]" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}
type ButtonTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ButtonText({ text, additionalClassNames = "" }: ButtonTextProps) {
  return (
    <div className={clsx("bg-white h-[40px] rounded-[8px]", additionalClassNames)}>
      <div className="content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-[4px] relative rounded-[inherit]">
        <ArrowDropDown />
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-center text-nowrap" dir="auto">
          {text}
        </p>
        <FilterList />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function FilterList() {
  return (
    <Wrapper7>
      <g id="filter_list">
        <path clipRule="evenodd" d={svgPaths.p3f91aa00} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon" />
      </g>
    </Wrapper7>
  );
}

function ArrowDropDown() {
  return (
    <Wrapper7>
      <g id="arrow_drop_down">
        <path clipRule="evenodd" d={svgPaths.pbe06c00} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon" />
      </g>
    </Wrapper7>
  );
}

function MaskGroup2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] bg-[#969696] h-[16px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[1.454px_-0.242px] mask-size-[16px_16px] ml-[-1.94px] mt-[0.24px] w-[19.394px]" style={{ maskImage: `url('${imgRectangle34624162}')` }} />
    </div>
  );
}
type Frame427319061TextProps = {
  text: string;
};

function Frame427319061Text({ text }: Frame427319061TextProps) {
  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="flex-none rotate-[180deg] scale-y-[-100%]">
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative text-[#969696] text-[14px] text-nowrap" dir="auto">
          {text}
        </p>
      </div>
    </div>
  );
}

function Horizontal() {
  return (
    <Wrapper>
      <path d="M0 0.5H968.232" id="Line" stroke="var(--stroke-0, #E8E8E8)" strokeDasharray="4 4 4 4" strokeMiterlimit="16" />
    </Wrapper>
  );
}
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("content-stretch flex items-center relative shrink-0", additionalClassNames)}>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <SmallArrowUp />
        </div>
      </div>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#272525] text-[14px] text-nowrap" dir="auto">
        {text}
      </p>
    </div>
  );
}

function SmallArrowUp() {
  return (
    <Wrapper1>
      <path d={svgPaths.p19036e80} id="shape" stroke="var(--stroke-0, #ED3237)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </Wrapper1>
  );
}

function Helper() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[46px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
        <circle cx="23" cy="23" fill="var(--fill-0, #F7F9FB)" id="Ellipse 13" r="23" />
      </svg>
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

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <AvatarOneLine />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame2 />
    </div>
  );
}

function Notifications() {
  return (
    <Wrapper8 additionalClassNames="ml-0 mt-0">
      <g id="notifications">
        <path d={svgPaths.p2aa09100} fill="var(--stroke-0, #111111)" id="Icon" />
      </g>
    </Wrapper8>
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

function Frame82() {
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

function Frame62() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0">
      <Frame33 />
      <Group />
      <MaskGroup />
      <Frame82 />
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

function Frame70() {
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
      <Frame70 />
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

function Frame66() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#130101] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          تماس‌ها
        </p>
      </div>
    </div>
  );
}

function IcRoundKeyboardArrowRight() {
  return (
    <Wrapper6>
      <g id="ic:round-keyboard-arrow-right">
        <path d={svgPaths.p4df0f00} fill="var(--fill-0, #111111)" id="Vector" />
      </g>
    </Wrapper6>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame66 />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <IcRoundKeyboardArrowRight />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-[#1e0202] content-stretch flex flex-col items-start p-[7.879px] relative rounded-[5px] shrink-0">
      <div className="flex flex-col font-['Vazirmatn:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[14.182px] text-nowrap text-white uppercase">
        <p className="leading-[12.606px]" dir="auto">
          رهگیر
        </p>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0">
      <Frame67 />
      <Frame40 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative shrink-0">
      <Frame61 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame62 />
      <SearchBar />
      <Frame63 />
    </div>
  );
}

function NavDashboard() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 overflow-clip px-[36px] py-[7px] top-0 w-[1248px]" data-name="Nav-Dashboard">
      <Frame68 />
    </div>
  );
}

function Group14() {
  return (
    <Wrapper2>
      <circle cx="25" cy="23" fill="var(--fill-0, #F7F9FB)" id="Ellipse 13" r="23" />
      <g id="Small Arrow Up">
        <path d={svgPaths.p17af1e00} id="shape" stroke="var(--stroke-0, #C8C8C8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </g>
      <g id="Payroll">
        <path clipRule="evenodd" d={svgPaths.p710a80} fill="var(--fill-0, #1E1E1E)" fillRule="evenodd" id="Vector" />
      </g>
    </Wrapper2>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center not-italic relative shrink-0 text-[#272525] text-nowrap">
      <p className="font-['Yekan_Bakh_FaNum:SemiBold',sans-serif] leading-[24px] relative shrink-0 text-[0px]" dir="auto">
        <span className="text-[24px]">{`3.6 `}</span>
        <span className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] not-italic text-[12px]">ستاره</span>
      </p>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] relative shrink-0 text-[13px] text-right" dir="ltr">
        میانگین امتیاز کارشناس فروشان
      </p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[236px]">
      <Group14 />
      <Frame23 />
    </div>
  );
}

function SmallArrowUp1() {
  return (
    <Wrapper1 additionalClassNames="shrink-0">
      <path d={svgPaths.p19036e80} id="shape" stroke="var(--stroke-0, #10A242)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </Wrapper1>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <SmallArrowUp1 />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#272525] text-[14px] text-nowrap" dir="auto">
        رشد نسبت به دوره قبل: +5%
      </p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[30px] items-end justify-center ml-[20px] mt-[26.36px] relative">
      <Frame25 />
      <Frame24 />
    </div>
  );
}

function Group16() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white border border-[#d5d5d5] border-solid h-[170.215px] ml-0 mt-0 rounded-[8px] w-[272px]" />
      <Frame27 />
    </div>
  );
}

function Payroll() {
  return (
    <Wrapper8 additionalClassNames="ml-[11px] mt-[11px]">
      <g id="Payroll"></g>
    </Wrapper8>
  );
}

function MaskGroup1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[11px] mt-[11.86px] place-items-start relative" data-name="Mask group">
      <div className="[grid-area:1_/_1] bg-[#1e1e1e] h-[23px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[3px_0.141px] mask-size-[23px_23px] ml-[-3px] mt-[-0.14px] w-[28px]" style={{ maskImage: `url('${imgRectangle34624107}')` }} />
    </div>
  );
}

function Group19() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Helper />
      <Payroll />
      <MaskGroup1 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center leading-[normal] not-italic relative shrink-0 text-[#272525] w-[174px]">
      <p className="font-['Yekan_Bakh_FaNum:Bold',sans-serif] relative shrink-0 text-[0px] text-nowrap" dir="auto">
        <span className="text-[24px]">{`1 `}</span>
        <span className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] not-italic text-[12px]">دقیقه و</span>
        <span className="text-[24px]">{` 30 `}</span>
        <span className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] not-italic text-[12px]">ثانیه</span>
      </p>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] relative shrink-0 text-[12px] text-right w-[246px]" dir="auto">{`میانگین مدت انتظار مشتری `}</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[236px]">
      <Group19 />
      <Frame26 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="[grid-area:1_/_1] bg-white content-stretch flex flex-col gap-[30px] items-end justify-center ml-[310px] mt-[26.36px] relative">
      <Frame28 />
      <Text text="رشد نسبت به دوره قبل: -5%" />
    </div>
  );
}

function Group17() {
  return (
    <div className="[grid-area:1_/_2] grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white border border-[#d5d5d5] border-solid h-[170.215px] ml-[290px] mt-0 rounded-[8px] w-[272px]" />
      <Frame29 />
    </div>
  );
}

function Group20() {
  return (
    <Wrapper2>
      <circle cx="25" cy="23" fill="var(--fill-0, #F7F9FB)" id="Ellipse 13" r="23" />
      <g id="Small Arrow Up">
        <path d={svgPaths.p22340880} id="shape" stroke="var(--stroke-0, #C8C8C8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </g>
      <g id="Payroll">
        <path clipRule="evenodd" d={svgPaths.p34eaa000} fill="var(--fill-0, #1E1E1E)" fillRule="evenodd" id="Vector" />
      </g>
    </Wrapper2>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center not-italic relative shrink-0 text-[#272525] text-nowrap">
      <p className="font-['Yekan_Bakh_FaNum:SemiBold',sans-serif] leading-[24px] relative shrink-0 text-[0px]" dir="auto">
        <span className="text-[24px]">{`20 `}</span>
        <span className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] not-italic text-[12px]">تماس</span>
      </p>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] relative shrink-0 text-[13px] text-right" dir="auto">
        تعداد تماس‌های ناموفق
      </p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[236px]">
      <Group20 />
      <Frame30 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[30px] items-end justify-center ml-[20px] mt-[213.36px] relative">
      <Frame31 />
      <Text text="کاهش نسبت به دوره قبل: -5%" additionalClassNames="justify-between w-[212px]" />
    </div>
  );
}

function Group15() {
  return (
    <div className="[grid-area:2_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white border border-[#d5d5d5] border-solid h-[170.215px] ml-0 mt-[187px] rounded-[8px] w-[272px]" />
      <Frame32 />
    </div>
  );
}

function DiscountCircle() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Discount Circle">
      <div className="absolute inset-[-3.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
          <g id="Discount Circle">
            <path d={svgPaths.p22895570} id="Vector" stroke="var(--stroke-0, #2D264B)" strokeLinecap="round" strokeWidth="1.5" />
            <g id="Vector_2">
              <path d={svgPaths.p3ba94100} fill="var(--fill-0, #2D264B)" />
              <path d={svgPaths.p3f18fe80} fill="var(--fill-0, #2D264B)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function HiconLinearDiscountCircle() {
  return (
    <div className="[grid-area:1_/_1] ml-[11px] mt-[10.72px] overflow-clip relative size-[24px]" data-name="Hicon / Linear / Discount Circle">
      <DiscountCircle />
    </div>
  );
}

function Group21() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Helper />
      <HiconLinearDiscountCircle />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center leading-[normal] not-italic relative shrink-0 text-[#272525] text-nowrap">
      <p className="font-['Yekan_Bakh_FaNum:Bold',sans-serif] relative shrink-0 text-[0px]" dir="auto">
        <span className="text-[24px]">{`40 `}</span>
        <span className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] not-italic text-[12px]">تماس</span>
      </p>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] relative shrink-0 text-[12px]" dir="auto">
        تعداد تماس‌های گرفته شده
      </p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[236px]">
      <Group21 />
      <Frame35 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="[grid-area:1_/_1] bg-white content-stretch flex flex-col gap-[30px] items-end justify-center ml-[310px] mt-[213.36px] relative">
      <Frame36 />
      <Text text="کاهش نسبت به دوره قبل: -5%" />
    </div>
  );
}

function Group18() {
  return (
    <div className="[grid-area:2_/_2] grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-white border border-[#d5d5d5] border-solid h-[170.215px] ml-[290px] mt-[187px] rounded-[8px] w-[272px]" />
      <Frame37 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="gap-[17px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(2,_minmax(0px,_1fr))] h-[357px] relative shrink-0 w-[563px]">
      <Group16 />
      <Group17 />
      <Group15 />
      <Group18 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents left-[404px] top-[27.1px]">
      <div className="absolute bg-[#14b8a6] h-[15.5px] left-[404px] rounded-[3px] top-[27.1px] w-[32.727px]" />
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] h-[12.056px] leading-[normal] left-[407.27px] not-italic text-[12px] text-white top-[27.1px] w-[32.727px]">+3%</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[0.91%_-11.59%_72.42%_89.83%]">
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] inset-[20.02%_-11.59%_72.42%_90.02%] leading-[normal] not-italic text-[#333] text-[12px] text-nowrap" dir="auto">
        پاسخ توسط مشتری
      </p>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] inset-[0.91%_2.5%_89.15%_89.94%] leading-[normal] not-italic text-[#14b8a6] text-[16px] text-nowrap">30%</p>
      <Group22 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents font-['Yekan_Bakh_FaNum:Regular',sans-serif] inset-[90.52%_-8.29%_-13.33%_87.61%] leading-[normal] not-italic">
      <p className="absolute inset-[98.22%_-8.29%_-13.33%_87.61%] text-[#333] text-[12px]" dir="auto">
        پاسخ توسط کارشناس فروش
      </p>
      <p className="absolute inset-[90.52%_4.98%_2.65%_87.67%] text-[#3b82f6] text-[16px]">25%</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents font-['Yekan_Bakh_FaNum:Regular',sans-serif] inset-[68.53%_81.54%_8.54%_-0.03%] leading-[normal] not-italic">
      <p className="absolute inset-[76.35%_81.54%_8.54%_0] text-[#454545] text-[12px]" dir="auto">
        عدم پاسخ کارشناس فروش
      </p>
      <p className="absolute inset-[68.53%_92.68%_24.63%_-0.03%] text-[#ec4899] text-[16px]">20%</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents font-['Yekan_Bakh_FaNum:Regular',sans-serif] inset-[93.84%_80.24%_-9.18%_-0.03%] leading-[normal] not-italic">
      <p className="absolute inset-[101.62%_80.24%_-9.18%_-0.03%] text-[#454545] text-[12px] text-nowrap" dir="auto">
        عدم پاسخ مشتری
      </p>
      <p className="absolute inset-[93.84%_92.68%_-0.68%_-0.03%] text-[#ec4863] text-[16px]">20%</p>
    </div>
  );
}

function Group23() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-[#ff8282] h-[16px] ml-0 mt-0 rounded-[3px] w-[33px]" />
      <p className="[grid-area:1_/_1] font-['Yekan_Bakh_FaNum:Regular',sans-serif] h-[11px] leading-[normal] ml-[2px] mt-[0.19px] not-italic relative text-[12px] text-white w-[31px]">-3%</p>
    </div>
  );
}

function Frame72() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] items-start left-0 top-[92.35px] w-[52.955px]">
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#f59e0b] text-[16px] text-nowrap" dir="auto">
        15%
      </p>
      <Group23 />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#333] text-[12px] text-nowrap" dir="auto">
        رد توسط مشتری
      </p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-0 top-[92.35px]">
      <Frame72 />
    </div>
  );
}

function Group24() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] bg-[#ff8282] h-[15.5px] ml-0 mt-0 rounded-[3px] w-[32.727px]" />
      <p className="[grid-area:1_/_1] font-['Yekan_Bakh_FaNum:Regular',sans-serif] h-[12.056px] leading-[normal] ml-[3.27px] mt-0 not-italic relative text-[12px] text-white w-[32.727px]">-3%</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-0 right-[92.11%] top-[calc(50%-104.89px)] translate-y-[-50%]">
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#facc15] text-[16px] text-center text-nowrap">10%</p>
      <Group24 />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#333] text-[12px] text-nowrap" dir="auto">
        رد توسط کارشناس فروش
      </p>
    </div>
  );
}

function Frame75() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex items-start justify-center ml-0 mt-0 relative">
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-center text-nowrap" dir="auto">
        تعداد کل تماس‌ها
      </p>
    </div>
  );
}

function Group29() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Frame75 />
      <div className="[grid-area:1_/_1] font-['Yekan_Bakh_FaNum:SemiBold',sans-serif] h-[17px] leading-[20px] ml-[45.15px] mt-[23.14px] not-italic relative text-[#0a0a0a] text-[18px] text-center tracking-[-0.9px] translate-x-[-50%] w-[23px]">
        <p className="mb-0" dir="auto">
          100
        </p>
        <p dir="auto">&nbsp;</p>
      </div>
    </div>
  );
}

function Group30() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group29 />
    </div>
  );
}

function TotalContainer() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-center justify-center min-h-px min-w-px mr-[-221.234px] relative shrink-0" data-name="Total-container">
      <Group30 />
    </div>
  );
}

function ChartContainer() {
  return (
    <div className="basis-0 content-stretch flex grow h-[224px] items-center min-h-px min-w-px pl-0 pr-[221.234px] py-0 relative shrink-0" data-name="Chart-container">
      <TotalContainer />
      <div className="h-full mr-[-221.234px] relative shrink-0 w-[221.234px]" data-name="Ellipse">
        <div className="absolute inset-[-0.45%_-0.45%_14.01%_49.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112.617 193.619">
            <path d={svgPaths.p395b7180} fill="var(--fill-0, #14B8A6)" id="Ellipse" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="h-full mr-[-221.234px] relative shrink-0 w-[221.234px]" data-name="Ellipse">
        <div className="absolute inset-[14.01%_74.82%_49.55%_-0.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.7054 81.619">
            <path d={svgPaths.p858d080} fill="var(--fill-0, #F59E0B)" id="Ellipse" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="h-full mr-[-221.234px] relative shrink-0 w-[221.234px]" data-name="Ellipse">
        <div className="absolute inset-[74.82%_14.01%_-0.45%_49.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80.6234 57.402">
            <path d={svgPaths.pb9da880} fill="var(--fill-0, #58B5E9)" id="Ellipse" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="h-full mr-[-221.234px] relative shrink-0 w-[221.234px]" data-name="Ellipse">
        <div className="absolute inset-[-0.22%_49.77%_75.14%_14.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 79.4207 56.1905">
            <path d={svgPaths.p19484f40} fill="var(--fill-0, #FACC15)" id="Ellipse" stroke="var(--stroke-0, white)" />
          </svg>
        </div>
      </div>
      <div className="h-full mr-[-221.234px] relative shrink-0 w-[221.234px]" data-name="Ellipse">
        <div className="absolute inset-[71.61%_49.55%_-0.45%_10.05%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89.3814 64.5968">
            <path d={svgPaths.p25773880} fill="var(--fill-0, #EC4863)" id="Ellipse" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="h-full mr-[-221.234px] relative shrink-0 w-[221.234px]" data-name="Ellipse">
        <div className="absolute inset-[49.24%_77.89%_18.86%_-0.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49.9177 71.464">
            <path d={svgPaths.p18a4df80} fill="var(--fill-0, #EC4899)" id="Ellipse" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="absolute content-stretch flex inset-[-1.82%_26.97%_0_24.52%] items-center justify-center" data-name="Donut Chart">
      <ChartContainer />
    </div>
  );
}

function Component() {
  return (
    <div className="[grid-area:1_/_1] h-[251.479px] ml-[54px] mt-[40px] relative w-[449.721px]" data-name="نمودار دایره‌ای">
      <div className="absolute bottom-[2.83%] left-[22.37%] right-1/4 top-[1.73%]">
        <div className="absolute inset-[-19.17%_-21.12%_-22.5%_-21.12%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 336.695 340">
            <g filter="url(#filter0_d_1_1794)" id="Ellipse 2">
              <ellipse cx="168.348" cy="166" fill="var(--fill-0, white)" rx="118.348" ry="120" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="340" id="filter0_d_1_1794" width="336.695" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1794" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1794" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Group10 />
      <Group1 />
      <Group2 />
      <Group4 />
      <Group3 />
      <Frame5 />
      <ComponentHelper additionalClassNames="absolute inset-[6.49%_67.29%_86.9%_9.94%]">
        <path d="M0 1H72.2455L102.42 17.6125" id="Line 6" stroke="var(--stroke-0, #CDCDCD)" strokeDasharray="2 2" strokeWidth="2" />
      </ComponentHelper>
      <div className="absolute flex inset-[6.49%_12.32%_86.9%_64.9%] items-center justify-center">
        <div className="flex-none h-[16.612px] rotate-[180deg] scale-y-[-100%] w-[102.42px]">
          <ComponentHelper additionalClassNames="relative size-full">
            <path d="M0 1H72.2455L102.42 17.6125" id="Line 9" stroke="var(--stroke-0, #CDCDCD)" strokeDasharray="2 2" strokeWidth="2" />
          </ComponentHelper>
        </div>
      </div>
      <div className="absolute flex inset-[90.17%_14.16%_4.01%_63.27%] items-center justify-center">
        <div className="flex-none h-[14.631px] rotate-[180deg] w-[101.517px]">
          <div className="relative size-full">
            <div className="absolute inset-[-6.83%_-0.48%_-5.96%_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102.006 16.5039">
                <path d="M0 1H75.3821L101.517 15.6313" id="Line 10" stroke="var(--stroke-0, #CDCDCD)" strokeDasharray="2 2" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[71.04%_70.42%_25.24%_9.9%] items-center justify-center">
        <div className="flex-none h-[9.349px] scale-y-[-100%] w-[88.494px]">
          <div className="relative size-full">
            <div className="absolute inset-[-10.7%_-0.31%_-10.28%_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 88.7704 11.3102">
                <path d="M0 1H55.9975L88.4939 10.3491" id="Line 7" stroke="var(--stroke-0, #CDCDCD)" strokeDasharray="2 2" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[85.43%_63.34%_1.18%_9.9%] items-center justify-center">
        <div className="flex-none h-[33.65px] scale-y-[-100%] w-[120.319px]">
          <div className="relative size-full">
            <div className="absolute inset-[-2.97%_-0.39%_-2.63%_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 120.782 35.5365">
                <path d="M0 1H55.9975L120.319 34.6504" id="Line 11" stroke="var(--stroke-0, #CDCDCD)" strokeDasharray="2 2" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[42.6%_76.48%_57.4%_10.81%] items-center justify-center">
        <div className="flex-none h-0 scale-y-[-100%] w-[57.158px]">
          <div className="relative size-full">
            <div className="absolute inset-[-1px_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.1581 2">
                <path d="M0 1H30.7551L57.1581 1" id="Line 8" stroke="var(--stroke-0, #CDCDCD)" strokeDasharray="2 2" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <DonutChart />
    </div>
  );
}

function Component1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="باکس نمودار دایره‌ای">
      <div className="[grid-area:1_/_1] bg-white border border-[#d5d5d5] border-solid h-[353px] ml-0 mt-0 rounded-[8px] w-[573px]" data-name="بک گراند" />
      <Component />
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex items-center justify-between leading-[0] relative shrink-0 w-full">
      <Frame39 />
      <Component1 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[42px] top-[172px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[183px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1073.18px] not-italic text-[#969696] text-[16px] text-center top-[172px] translate-x-[-50%] w-[37.639px]">950</p>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[953.956px]">
      <Frame427319061Text text="0" />
      <Frame427319061Text text="-" />
      <Frame427319061Text text="8" />
      <Frame427319061Text text="9" />
      <Frame427319061Text text="10" />
      <Frame427319061Text text="11" />
      <Frame427319061Text text="12" />
      <Frame427319061Text text="13" />
      <Frame427319061Text text="14" />
      <Frame427319061Text text="15" />
      <Frame427319061Text text="16" />
      <Frame427319061Text text="17" />
      <Frame427319061Text text="18" />
      <Frame427319061Text text="-" />
      <Frame427319061Text text="24" />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[42px] top-[216px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[227px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1073.18px] not-italic text-[#969696] text-[16px] text-center top-[216px] translate-x-[-50%] w-[35.043px]">800</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[42px] top-[260px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[271px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1072.53px] not-italic text-[#969696] text-[16px] text-center top-[260px] translate-x-[-50%] w-[36.341px]">650</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[42px] top-[304px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[315px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1072.53px] not-italic text-[#969696] text-[16px] text-center top-[304px] translate-x-[-50%] w-[36.341px]">400</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[42px] top-[348px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[359px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1072.53px] not-italic text-[#969696] text-[16px] text-center top-[348px] translate-x-[-50%] w-[36.341px]">250</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[42px] top-[392px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[403px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1066.04px] not-italic text-[#969696] text-[16px] text-center top-[392px] translate-x-[-50%] w-[25.958px]">50</p>
    </div>
  );
}

function Horizontal1() {
  return (
    <Wrapper>
      <path d="M0 0.5H968.232" id="Line" stroke="var(--stroke-0, #E8E8E8)" />
    </Wrapper>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[42px] top-[436px]">
      <div className="absolute flex h-px items-center justify-center left-[42px] top-[447px] w-[968.232px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Horizontal1 />
        </div>
      </div>
      <p className="absolute font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] left-[1060.2px] not-italic text-[#969696] text-[16px] text-center top-[436px] translate-x-[-50%] w-[11.681px]">0</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents left-[42px] top-[172px]">
      <Group11 />
      <div className="absolute flex items-center justify-center left-[45.89px] top-[460px] w-[953.956px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Frame60 />
        </div>
      </div>
      <Group12 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group45() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative">
      <MaskGroup2 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white bottom-[86.83%] left-[calc(50%-461.5px)] rounded-[8px] top-[6.05%] translate-x-[-50%]" data-name="Button">
      <Text14 text="گزارشگیری">
        <Group45 />
      </Text14>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function Frame() {
  return (
    <Text15 text="تماس خروجی" additionalClassNames="left-[546px] top-[61px]">
      <circle cx="8" cy="8" fill="var(--fill-0, #56B4E9)" fillOpacity="0.3" id="oval" r="7.5" stroke="var(--stroke-0, #56B4E9)" />
    </Text15>
  );
}

function Frame1() {
  return (
    <Text15 text="تماس ورودی" additionalClassNames="left-[547px] top-[30px]">
      <circle cx="8" cy="8" fill="var(--fill-0, #F59E0B)" fillOpacity="0.44" id="oval" r="7.5" stroke="var(--stroke-0, #F59E0B)" />
    </Text15>
  );
}

function Frame4() {
  return (
    <div className="bg-white h-[562px] overflow-clip relative rounded-[8px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.18)] shrink-0 w-full">
      <p className="absolute font-['Yekan_Bakh_FaNum:Bold',sans-serif] leading-[normal] left-[calc(50%+133.5px)] not-italic text-[#1c1c1c] text-[30px] text-nowrap top-[29.79px]" dir="auto">
        نمودار میانگین تماس‌ها دوره‌ای
      </p>
      <Group13 />
      <p className="absolute font-['Yekan_Bakh_FaNum:Bold',sans-serif] leading-[normal] left-[1031px] not-italic text-[14px] text-black text-nowrap top-[124px]" dir="auto">
        تعداد تماس
      </p>
      <div className="absolute flex flex-col font-['Yekan_Bakh_FaNum:SemiBold',sans-serif] justify-center leading-[0] left-[calc(50%-36.5px)] not-italic text-[14px] text-black text-nowrap top-[519px] translate-y-[-50%]">
        <p className="leading-[normal]" dir="auto">
          ساعت تماس
        </p>
      </div>
      <Frame11Helper additionalClassNames="top-[212.5px]">
        <div className="absolute inset-[-0.52%_-0.08%_-0.28%_-0.03%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 903.033 234.357">
            <path d={svgPaths.p17eac500} id="Line 1" stroke="var(--stroke-0, #58B5E9)" strokeWidth="2" />
          </svg>
        </div>
      </Frame11Helper>
      <Frame11Helper additionalClassNames="top-[172px]">
        <div className="absolute inset-[-0.52%_-0.08%_-0.28%_-0.03%]" style={{ "--stroke-0": "rgba(255, 141, 40, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 903.033 234.357">
            <path d={svgPaths.p17eac500} id="Line 2" stroke="var(--stroke-0, #FF8D28)" strokeWidth="2" />
          </svg>
        </div>
      </Frame11Helper>
      <Button />
      <ButtonText text="بازه زمانی" additionalClassNames="absolute left-[179px] top-[34px]" />
      <ButtonText text="نوع تماس" additionalClassNames="absolute left-[292px] top-[34px]" />
      <Frame />
      <Frame1 />
    </div>
  );
}

function TextState1() {
  return (
    <div className="absolute inset-[8px_0_8px_12px]" data-name="Text State">
      <p className="absolute font-['Vazir_FD:Regular',sans-serif] inset-0 leading-[24px] not-italic text-[#585757] text-[16px]">10</p>
    </div>
  );
}

function Left1() {
  return (
    <div className="absolute h-[40px] left-0 overflow-clip right-[32px] top-1/2 translate-y-[-50%]" data-name="Left">
      <TextState1 />
    </div>
  );
}

function TextField() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Text Field">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Left1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TextField1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[64px]" data-name="Text Field">
      <TextField />
    </div>
  );
}

function GoTo() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[81px] top-[1288px]" data-name="Go to">
      <TextField1 />
      <p className="font-['Vazir_FD:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#585757] text-[16px] text-nowrap" dir="auto">
        برو به صفحه
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f7f9fb] content-stretch flex h-[40px] items-center justify-between relative rounded-[20px] w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text1 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="30 ثانیه" />
      <Text3 text="1 دقیقه و 30 ثانیه ..." />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#0995aa] text-[16px] text-center w-[107px]" dir="auto">
            در حال مکالمه
          </p>
        </div>
      </div>
      <Text4 text="-" />
    </div>
  );
}

function Group26() {
  return (
    <Wrapper3>
      <Frame6 />
    </Wrapper3>
  );
}

function Frame7() {
  return (
    <div className="bg-[#f7f9fb] content-stretch flex h-[40px] items-center justify-between relative rounded-[20px] w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text1 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="30 ثانیه" />
      <Text3 text="1 دقیقه و 30 ثانیه ..." />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#3498db] text-[16px] text-center w-[159px]" dir="auto">
            مشتری در انتظار پاسخ
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] text-center w-[111px]" dir="auto">
            -
          </p>
        </div>
      </div>
    </div>
  );
}

function Group33() {
  return (
    <Wrapper3>
      <Frame7 />
    </Wrapper3>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text1 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] text-center w-[124px]" dir="auto">
            0
          </p>
        </div>
      </div>
      <Text5 text="عدم پاسخ" />
      <Text4 text="-" />
    </div>
  );
}

function Group32() {
  return (
    <Wrapper4>
      <Frame8 />
    </Wrapper4>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#585757] text-[16px] w-[104px]" dir="auto">
            0
          </p>
        </div>
      </div>
      <Text5 text="رد مشتری" />
      <Text4 text="0" />
    </div>
  );
}

function Group28() {
  return (
    <Wrapper4>
      <Frame9 />
    </Wrapper4>
  );
}

function Frame10() {
  return (
    <Wrapper5>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#e67e22] text-[16px] text-center text-nowrap" dir="auto">
        رد کارشناس فروش
      </p>
    </Wrapper5>
  );
}

function Group31() {
  return (
    <Wrapper4>
      <Frame10 />
    </Wrapper4>
  );
}

function Frame11() {
  return (
    <Wrapper5>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#959800] text-[16px] text-center text-nowrap" dir="auto">
        عدم دسترسی
      </p>
    </Wrapper5>
  );
}

function Group44() {
  return (
    <Wrapper4>
      <Frame11 />
    </Wrapper4>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - موبایل" />
      <Text8 text="(هنوز در دسترس نیست)" />
    </div>
  );
}

function Group27() {
  return (
    <Wrapper4>
      <Frame12 />
    </Wrapper4>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[24px] not-italic relative text-[#1abc9c] text-[16px] text-center text-nowrap" dir="auto">
            پاسخ - فروش موفق
          </p>
        </div>
      </div>
      <Text9 text="5" />
    </div>
  );
}

function Group34() {
  return (
    <Wrapper4>
      <Frame13 />
    </Wrapper4>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - علاقه‌مند به خرید در آینده" />
      <Text9 text="5" />
    </div>
  );
}

function Group35() {
  return (
    <Wrapper4>
      <Frame14 />
    </Wrapper4>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - رد محترمانه" />
      <Text9 text="5" />
    </div>
  );
}

function Group36() {
  return (
    <Wrapper4>
      <Frame15 />
    </Wrapper4>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - اعتراض به قیمت" />
      <Text9 text="5" />
    </div>
  );
}

function Group37() {
  return (
    <Wrapper4>
      <Frame16 />
    </Wrapper4>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - مقایسه با رقبا" />
      <Text9 text="5" />
    </div>
  );
}

function Group38() {
  return (
    <Wrapper4>
      <Frame17 />
    </Wrapper4>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - مشتری مردد" />
      <Text9 text="5" />
    </div>
  );
}

function Group39() {
  return (
    <Wrapper4>
      <Frame18 />
    </Wrapper4>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - مشتری عصبانی از تماس" />
      <Text9 text="5" />
    </div>
  );
}

function Group40() {
  return (
    <Wrapper4>
      <Frame19 />
    </Wrapper4>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - دعوا و قطع تماس" />
      <Text9 text="5" />
    </div>
  );
}

function Group41() {
  return (
    <Wrapper4>
      <Frame20 />
    </Wrapper4>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ - فروش با تخفیف اجباری" />
      <Text9 text="5" />
    </div>
  );
}

function Group42() {
  return (
    <Wrapper4>
      <Frame21 />
    </Wrapper4>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-between relative w-[1114px]">
      <Text1 text="آقای جابر یوسفی" />
      <Text3 text="آقای جابر یوسفی" />
      <Text2 text="17:40" />
      <Text3 text="1 دقیقه و 30 ثانیه" />
      <Text7 text="5 دقیقه و 30 ثانیه" />
      <Text8 text="پاسخ -اعتمادسازی و شروع همکاری" />
      <Text9 text="5" />
    </div>
  );
}

function Group43() {
  return (
    <Wrapper4>
      <Frame22 />
    </Wrapper4>
  );
}

function Frame77() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start leading-[0] left-[27px] top-[189px] w-[1122px]">
      <Group26 />
      <Group33 />
      <Group32 />
      <Group28 />
      <Group31 />
      <Group44 />
      <Group27 />
      <Group34 />
      <Group35 />
      <Group36 />
      <Group37 />
      <Group38 />
      <Group39 />
      <Group40 />
      <Group41 />
      <Group42 />
      <Group43 />
    </div>
  );
}

function Group46() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative">
      <MaskGroup2 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[40px] relative rounded-[8px] shrink-0" data-name="Button">
      <Text14 text="گزارشگیری">
        <Group46 />
      </Text14>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[186px]">
      <div className="h-[13px] relative shrink-0 w-[12.992px]" data-name="Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.9922 12.9998">
          <path clipRule="evenodd" d={svgPaths.p2cc2e9c0} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon" />
        </svg>
      </div>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#969696] text-[12px] text-nowrap" dir="auto">
        اطلاعات مد نظر خود را وارد کنید...
      </p>
    </div>
  );
}

function TextState2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="Text State">
      <Wrapper10>
        <path clipRule="evenodd" d={svgPaths.pb341300} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon" />
      </Wrapper10>
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#969696] text-[12px] text-nowrap" dir="auto">
        جست و جو بر اساس
      </p>
    </div>
  );
}

function Frame79() {
  return (
    <div className="absolute content-stretch flex gap-[9px] items-center left-[18px] top-[0.21px]">
      <Frame71 />
      <div className="flex h-[41px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <div className="h-0 relative w-[41px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 1">
                <line id="Line 291" stroke="var(--stroke-0, #EEEEEE)" x2="41" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <TextState2 />
    </div>
  );
}

function SearchBar1() {
  return (
    <div className="bg-[#f7f9fb] h-[40px] overflow-clip relative rounded-[8px] shrink-0 w-[355px]" data-name="Search Bar">
      <Frame79 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[39.459px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="content-stretch flex font-['Yekan_Bakh_FaNum:Regular',sans-serif] gap-[4px] h-full items-center not-italic overflow-clip px-[8px] py-[4px] relative rounded-[inherit] text-center">
        <p className="h-[4px] leading-[0] relative shrink-0 text-[#585858] text-[20px] w-[7px]">+</p>
        <p className="leading-[normal] relative shrink-0 text-[#1c1c1c] text-[12px] text-nowrap" dir="auto">
          مدیریت فیلترها
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function Frame80() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[30px] top-[36.79px]">
      <Button1 />
      <SearchBar1 />
      <ButtonText text="اصلاح ستون‌ها" additionalClassNames="relative shrink-0" />
      <Button2 />
    </div>
  );
}

function HeaderText() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[10px] h-[27.944px] items-center justify-center ml-0 mt-0 relative w-[85px]" data-name="Header/Text">
      <Icon />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#364153] text-[14px] text-center text-nowrap" dir="auto">
        امتیاز مکالمه
      </p>
    </div>
  );
}

function Group47() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <HeaderText />
    </div>
  );
}

function HeaderText1() {
  return (
    <div className="h-[27px] relative shrink-0 w-[82px]" data-name="Header/Text">
      <div className="flex flex-row items-center justify-center size-full">
        <Text11 text="مدت تماس" additionalClassNames="px-[16px] py-[18px] size-full" />
      </div>
    </div>
  );
}

function HeaderText2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-[72px]" data-name="Header/Text">
      <Icon />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#364153] text-[14px] text-nowrap" dir="auto">{` مشتری`}</p>
    </div>
  );
}

function Frame81() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[27px] top-[117px] w-[1103px]">
      <Group47 />
      <HeaderTextText text="متن خلاصه تماس" />
      <HeaderTextText text="صدای ضبط شده" />
      <HeaderTextText text="وضعیت نهایی تماس" />
      <HeaderText1 />
      <Text10 text="مدت انتظار" additionalClassNames="h-[21px] w-[111px]" />
      <HeaderText2 />
      <Text11 text="کارشناس فروش" additionalClassNames="shrink-0 w-[120px]" />
      <Text10 text="نوع تماس" additionalClassNames="w-[50px]" />
      <Text10 text="ساعت" additionalClassNames="w-[50px]" />
      <Text10 text="تاریخ" additionalClassNames="w-[50px]" />
    </div>
  );
}

function Group48() {
  return (
    <div className="absolute contents left-0 top-[106px]">
      <div className="absolute bg-[#f7f9fb] h-[50px] left-0 top-[106px] w-[1158px]" />
      <Horizontal2 additionalClassNames="top-[106px]" />
      <Horizontal2 additionalClassNames="top-[156px]" />
      <Frame81 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-white h-[1365px] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <GoTo />
        <Frame77 />
        <Frame80 />
        <Group48 />
        <p className="absolute font-['Yekan_Bakh_FaNum:Bold',sans-serif] h-[38px] leading-[normal] left-[1020px] not-italic text-[#1c1c1c] text-[30px] top-[37px] w-[110px]" dir="auto">
          تماس‌ها
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d5d5] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame78() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[25px] items-start left-[46px] top-[128px] w-[1157px]">
      <Frame74 />
      <Frame4 />
      <Frame38 />
    </div>
  );
}

function Icon2() {
  return (
    <Icon1>
      <path clipRule="evenodd" d={svgPaths.p1523d2f0} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon_2" />
    </Icon1>
  );
}

function Button3() {
  return (
    <Button7 additionalClassNames="opacity-40">
      <Icon2 />
    </Button7>
  );
}

function XBaseArrow() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-Base/Arrow">
      <Button3 />
    </div>
  );
}

function XBasePage() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-Base/Page">
      <ButtonText1 text="4" />
    </div>
  );
}

function XBasePage1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-Base/Page">
      <ButtonText1 text="3" />
    </div>
  );
}

function XBasePage2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-Base/Page">
      <ButtonText1 text="2" />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#0e1b27] content-stretch flex flex-col items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_2px_1px_0px_rgba(0,0,0,0.06),0px_1px_1px_0px_rgba(0,0,0,0.08)] shrink-0" data-name="Button">
      <p className="font-['Vazir_FD:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white">1</p>
    </div>
  );
}

function XBasePage3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-Base/Page">
      <Button4 />
    </div>
  );
}

function Icon3() {
  return (
    <Icon1>
      <path clipRule="evenodd" d={svgPaths.p31ea4a80} fill="var(--fill-0, #969696)" fillRule="evenodd" id="Icon_2" />
    </Icon1>
  );
}

function Button5() {
  return (
    <Button7>
      <Icon3 />
    </Button7>
  );
}

function XBaseArrow1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="x-Base/Arrow">
      <Button5 />
    </div>
  );
}

function Default() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-[915px] top-[2385px]" data-name="Default">
      <XBaseArrow />
      <XBasePage />
      <XBasePage1 />
      <XBasePage2 />
      <XBasePage3 />
      <XBaseArrow1 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[20px]">
      <div className="bg-[#adadad] h-[2px] rounded-[2px] shrink-0 w-full" />
      <div className="bg-[#adadad] h-[2px] rounded-[2px] shrink-0 w-full" />
      <div className="bg-[#adadad] h-[2px] rounded-[2px] shrink-0 w-full" />
    </div>
  );
}

function Frame69() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%-15px)] px-[2px] py-0 top-0 translate-x-[-50%] w-[210px]">
      <Frame76 />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#969696] text-[12px] text-nowrap" dir="auto">
        منوی اصلی
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-[240px]">
      <Frame69 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text13 text="داشبورد" />
      <PhUsers />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame41 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text13 text="تماس‌ها" />
      <PhUsers />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame43 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text13 text="کارشناسان فروش" />
      <PhUsers />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame52 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text13 text="مشتریان" />
      <PhUsers />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame53 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#181616] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          کارشناس فروشان
        </p>
      </div>
      <div className="relative shrink-0 size-[25px]" data-name="Cloud Storage">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgCloudStorage} />
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame54 />
    </div>
  );
}

function MdiGraphBellCurveCumulative() {
  return (
    <div className="content-stretch flex items-start overflow-clip px-[3px] py-0 relative shrink-0" data-name="mdi:graph-bell-curve-cumulative">
      <div className="relative shrink-0 size-[21px]" data-name="Database Administrator">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgDatabaseAdministrator} />
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#181616] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          هوش مصنوعی
        </p>
      </div>
      <MdiGraphBellCurveCumulative />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame55 />
    </div>
  );
}

function DashboardTabs() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end justify-center relative shrink-0" data-name="Dashboard-tabs">
      <Frame48 />
      <Frame49 />
      <Frame50 />
      <Frame51 />
      <Frame42 />
      <Frame47 />
    </div>
  );
}

function DashboardMainmenu() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] items-start left-[24px] top-[122px]" data-name="Dashboard-mainmenu">
      <Frame3 />
      <DashboardTabs />
    </div>
  );
}



function PhUsers1() {
  return (
    <div className="h-[26px] relative shrink-0 w-[25px]" data-name="ph:users">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-full left-[2%] max-w-none top-0 w-[104%]" src={imgPhUsers} />
      </div>
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text13 text="آموزش‌ها" />
      <PhUsers1 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame56 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[11px] items-center justify-center relative shrink-0">
      <Text13 text="پشتیبانی" />
      <div className="relative shrink-0 size-[23px]" data-name="Online Support">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgOnlineSupport} />
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame57 />
    </div>
  );
}

function IonSettingsOutline() {
  return <div className="h-[16.719px] shrink-0 w-[16.251px]" data-name="ion:settings-outline" />;
}

function Frame65() {
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

function Frame58() {
  return (
    <div className="content-stretch flex gap-[15px] items-center justify-center relative shrink-0">
      <IonSettingsOutline />
      <div className="flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#181616] text-[16px] text-nowrap">
        <p className="leading-[normal]" dir="auto">
          تنظیمات
        </p>
      </div>
      <Frame65 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col h-[53px] items-end justify-center pl-[8px] pr-[24px] py-[8px] relative rounded-[8px] shrink-0 w-[212px]">
      <Frame58 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame46 />
      <Frame45 />
      <Frame44 />
    </div>
  );
}

function DashboardMoreSettings() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0" data-name="Dashboard-more settings">
      <Frame59 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col h-[189px] items-center justify-center left-0 p-[8px] w-[264px]">
      <DashboardMoreSettings />
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute bg-white h-[1000px] left-[1248px] overflow-clip shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] top-0 w-[264px]" data-name="Component 3">
      <div className="absolute bg-gradient-to-r from-[#eff6ff] h-[71px] left-0 to-[#eef2ff] top-0 via-[#eef4ff] via-[48.558%] w-[264px]" />
      <DashboardMainmenu />
      <Frame64 />
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

function MaskGroup4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="[grid-area:1_/_1] bg-[#929292] h-[25.556px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_2.222px] mask-size-[20px_20px] ml-0 mt-[-2.22px] w-[23.333px]" style={{ maskImage: `url('${imgRectangle34624161}')` }} />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-[252px]" data-name="Button">
      <div className="content-stretch flex items-center justify-between overflow-clip px-[8px] py-[4px] relative rounded-[inherit] w-full">
        <MaskGroup4 />
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-center text-nowrap" dir="auto">
          تاریخ پایان
        </p>
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <div className="h-[3.5px] relative w-[12.969px]">
              <div className="absolute inset-[-14.29%_-11.31%_-11.31%_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.436 4.39596">
                  <path d="M0 0.5H12.9688L8.42969 4" id="Line 290" stroke="var(--stroke-0, #929292)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-center text-nowrap" dir="auto">
          تاریخ شروع
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d5d5d5] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Button6 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[1142px]">
      <Frame34 />
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-center text-nowrap" dir="auto">
        فیلتر داده‌ها (براساس):
      </p>
    </div>
  );
}

function NavDashboard1() {
  return (
    <div className="absolute h-[41px] left-0 overflow-clip top-[78px] w-[1248px]" data-name="Nav-Dashboard">
      <Frame73 />
    </div>
  );
}

export default function Component2() {
  return (
    <div className="bg-[#f7f9fb] relative size-full" data-name="تماس‌ها">
      <NavDashboard />
      <Frame78 />
      <Default />
      <Component3 />
      <NavDashboard1 />
    </div>
  );
}