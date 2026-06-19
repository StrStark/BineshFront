import svgPaths from "./svg-lkj34ktpju";
import clsx from "clsx";
import imgMoonAndStars from "figma:asset/27bb79d6090e7d398ac0df5f4fd148d65b24431d.png";
import { imgRectangle34624214 } from "./svg-zgd3h";
type Frame1261153541HelperProps = {
  additionalClassNames?: string;
};

function Frame1261153541Helper({ children, additionalClassNames = "" }: React.PropsWithChildren<Frame1261153541HelperProps>) {
  return (
    <div className={clsx("flex-none", additionalClassNames)}>
      <div className="h-0 relative w-[30px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 1">
            {children}
          </svg>
        </div>
      </div>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute h-[941.245px] left-[225px] top-[-30px] w-[827.092px]" data-name="Mask group">
      <div className="absolute inset-[-0.05%_-0.06%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 828.092 942.245">
          <g id="Mask group">
            <g id="Vector 25">
              <path d={svgPaths.p2678de80} stroke="url(#paint0_linear_5_6406)" strokeOpacity="0.12" />
              <path d={svgPaths.pab3d100} stroke="url(#paint1_linear_5_6406)" strokeOpacity="0.12" />
              <path d={svgPaths.p35ce2a30} stroke="url(#paint2_linear_5_6406)" strokeOpacity="0.12" />
              <path d={svgPaths.p268b2080} stroke="url(#paint3_linear_5_6406)" strokeOpacity="0.12" />
            </g>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_5_6406" x1="414.046" x2="414.046" y1="0.5" y2="941.745">
              <stop stopColor="#68A2CE" />
              <stop offset="1" stopColor="#3C546E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="absolute left-[799px] size-[29px] top-[138px]" data-name="Mask group">
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

function Frame2() {
  return (
    <div className="content-stretch flex flex-col font-['Yekan_Bakh_FaNum:Regular',sans-serif] items-end justify-center leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(14,21,38,0.69)] text-nowrap">
      <p className="relative shrink-0" dir="auto">
        مدیر محترم شرکت ---، خوش آمدید.
      </p>
      <p className="relative shrink-0" dir="auto">
        لطفا جهت ورود به نرم افزار شماره موبایل خود را وارد نمایید.
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[100px] h-[24px] items-center relative shrink-0 w-[304px]">
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0e1526] text-[14px] text-nowrap" dir="auto">
        0913 123 4567
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex items-center ml-[12px] mt-[13px] relative w-[318px]">
      <Frame1 />
    </div>
  );
}

function NumInput() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="numInput">
      <div className="[grid-area:1_/_1] h-[50px] ml-0 mt-0 relative rounded-[8px] w-[350px]">
        <div aria-hidden="true" className="absolute border border-[#0e1526] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      </div>
      <Frame />
    </div>
  );
}

function InputField() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0 w-[350px]" data-name="Input Field">
      <NumInput />
    </div>
  );
}

function Email() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-[350px]" data-name="Email">
      <InputField />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0">
      <Email />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[350px]" data-name="Component 2">
      <Frame3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#0e1b27] content-stretch flex h-[50px] items-center justify-center p-[10px] relative rounded-[10px] shrink-0 w-[350px]" data-name="Button">
      <p className="font-['Vazirmatn:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[14px] text-nowrap text-white" dir="auto">
        ورود
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-full">
      <Button />
      <p className="font-['Vazirmatn:Light',sans-serif] font-light leading-[24px] min-w-full relative shrink-0 text-[#8ca3b8] text-[0px] text-[10px] text-right w-[min-content]" dir="auto">
        <span>{`ورود شما به معنای پذیرش `}</span>شرایط ش<span>{`رکت `}</span>
        <span className="text-[#0e1b27]">بینش‌افزار آتی‌نگر</span>
        <span>{` و`}</span> <span className="text-[#0e1b27]">قوانین حریم‌خصوصی</span>
        <span>{` است.`}</span>
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <p className="font-['Vazirmatn:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#0e1526] text-[14px] text-nowrap" dir="auto">
        ‌نمی‌توانم وارد شوم!
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Frame4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
      <Component1 />
      <Frame6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex flex-col h-[261px] items-end justify-between left-[465px] top-[382px] w-[350px]">
      <Frame2 />
      <Frame7 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0 w-full">
      <div className="flex items-center justify-center relative shrink-0">
        <Frame1261153541Helper additionalClassNames="rotate-[180deg]">
          <line id="Line 306" stroke="var(--stroke-0, #0E1B27)" x2="30" y1="0.5" y2="0.5" />
        </Frame1261153541Helper>
      </div>
      <p className="font-['Yekan_Bakh_FaNum:Light',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap" dir="auto">
        سیستم هوشمند مدیریت داده‌ها
      </p>
      <div className="flex h-[0.454px] items-center justify-center relative shrink-0 w-[29.997px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <Frame1261153541Helper additionalClassNames="rotate-[179.132deg]">
          <line id="Line 307" stroke="var(--stroke-0, #0E1B27)" x2="30" y1="0.5" y2="0.5" />
        </Frame1261153541Helper>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[523px] top-[261px] w-[234px]">
      <p className="font-['Yekan_Bakh_FaNum:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[0px] text-black text-center w-full" dir="auto">
        <span className="text-[20px]">پنل مدیریت داده </span>
        <span className="text-[40px]"> </span>
        <span className="font-['Yekan_Bakh_FaNum:Bold',sans-serif] text-[#0e1b27] text-[40px]">بـیـنش</span>
      </p>
      <Frame9 />
    </div>
  );
}

function MaskGroup2() {
  return (
    <div className="absolute contents left-[629px] top-[193px]" data-name="Mask group">
      <div className="absolute bg-[#0e1b27] h-[84px] left-[617px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[12px_11px] mask-size-[60px_68.281px] top-[182px] w-[94px]" style={{ maskImage: `url('${imgRectangle34624214}')` }} />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[464px] top-[192px]">
      <Frame8 />
      <Frame10 />
      <MaskGroup2 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f7f9fb] border border-black border-solid relative size-full" data-name="صفحه ورود">
      <MaskGroup />
      <MaskGroup1 />
      <Group />
    </div>
  );
}