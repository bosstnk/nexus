import type { ReactNode } from "react"
import Button from "../components/Button"

/* ── demo icons ───────────────────────────────────────────── */
const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const Download = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const Edit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)
const Trash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
)

/* ── layout helpers ───────────────────────────────────────── */
function Section({ title, code, children }: { title: string; code: string; children: ReactNode }) {
  return (
    <section className="mb-[20px] rounded-2xl border border-neutral-200 bg-white px-[32px] pb-[32px] pt-[28px]">
      <div className="mb-[22px] flex items-baseline justify-between gap-[16px] border-b border-neutral-200 pb-[14px]">
        <h2 className="text-h4">{title}</h2>
        <span className="font-eng text-xs uppercase tracking-[0.08em] text-neutral-500">{code}</span>
      </div>
      <div className="flex flex-col gap-[4px]">{children}</div>
    </section>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-[14px] border-t border-dashed border-neutral-200 py-[14px] first:border-t-0">
      <div className="w-[132px] shrink-0 text-body-2 font-medium text-neutral-600">
        {label}
        {hint && <small className="block font-eng text-[10px] font-normal tracking-[0.05em] text-neutral-500">{hint}</small>}
      </div>
      <div className="flex flex-wrap items-center gap-[12px]">{children}</div>
    </div>
  )
}

export default function ButtonsShowcase() {
  return (
    <main className="mx-auto max-w-[1080px] px-[40px] py-[48px]">
      <header className="mb-[40px]">
        <p className="mb-[10px] font-eng text-xs font-semibold uppercase tracking-[0.14em] text-green-600">
          Design System · Components
        </p>
        <h1 className="text-h1 mb-[8px]">ปุ่ม / Buttons</h1>
        <p className="max-w-[620px] text-body-1 text-neutral-600">
          ชุดปุ่มทั้งหมดของระบบ TST &amp; BTK — variants, ขนาด, สถานะ, ปุ่มไอคอน, สถานะโหลด และตัวปรับแต่ง
          ทุกตัวเป็น <code className="rounded bg-neutral-100 px-[6px] py-[2px] font-eng text-[12px] text-green-700">&lt;Button /&gt;</code> component เดียว
        </p>
      </header>

      {/* Variants */}
      <Section title="Variants — ชนิดของปุ่ม" code=".primary · secondary · outline · ghost · subtle · danger">
        <Row label="Primary" hint="main CTA">
          <Button variant="primary">บันทึกข้อมูล</Button>
          <Button variant="primary">Save record</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </Row>
        <Row label="Secondary" hint="alternate">
          <Button variant="secondary">ส่งออกข้อมูล</Button>
          <Button variant="secondary">Export</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </Row>
        <Row label="Outline" hint="toolbar">
          <Button variant="outline">ตัวกรอง</Button>
          <Button variant="outline">Filter</Button>
          <Button variant="outline" disabled>Disabled</Button>
        </Row>
        <Row label="Ghost" hint="secondary brand">
          <Button variant="ghost">ดูทั้งหมด</Button>
          <Button variant="ghost">View all</Button>
        </Row>
        <Row label="Danger" hint="destructive">
          <Button variant="danger">ลบรายการ</Button>
          <Button variant="danger-soft">ลบ (soft)</Button>
          <Button variant="danger" disabled>Disabled</Button>
        </Row>
      </Section>

      {/* Sizes */}
      <Section title="Sizes — ขนาด" code="xs · small · base · large · extraLarge">
        <Row label="Scale">
          <Button size="xs">XS</Button>
          <Button size="small">Small</Button>
          <Button size="base">Base</Button>
          <Button size="large">Large</Button>
          <Button size="extraLarge">Extra large</Button>
        </Row>
        <Row label="Outline scale">
          <Button variant="outline" size="xs">XS</Button>
          <Button variant="outline" size="small">Small</Button>
          <Button variant="outline" size="base">Base</Button>
          <Button variant="outline" size="large">Large</Button>
        </Row>
      </Section>

      {/* With icons */}
      <Section title="With icons — ปุ่มพร้อมไอคอน" code="svg as children · iconOnly for icon-only">
        <Row label="Leading icon">
          <Button variant="primary"><Plus />เพิ่มรายการ</Button>
          <Button variant="outline"><Download />ดาวน์โหลด</Button>
        </Row>
        <Row label="Trailing icon">
          <Button variant="ghost">ถัดไป<ArrowRight /></Button>
          <Button variant="primary">ส่งรายงาน<ArrowRight /></Button>
        </Row>
        <Row label="Icon only" hint="iconOnly">
          <Button iconOnly variant="primary" aria-label="เพิ่ม"><Plus /></Button>
          <Button iconOnly variant="outline" aria-label="แก้ไข"><Edit /></Button>
          <Button iconOnly variant="outline" size="small" aria-label="ตัวกรอง"><Download /></Button>
          <Button iconOnly variant="danger" size="large" aria-label="ลบ"><Trash /></Button>
        </Row>
      </Section>

      {/* States */}
      <Section title="States — สถานะ" code="hover · active · focus · disabled · loading">
        <Row label="Loading" hint="loading">
          <Button variant="primary" loading>บันทึก</Button>
          <Button variant="secondary" loading>Export</Button>
          <Button variant="outline" loading>Filter</Button>
          <Button variant="danger" loading>ลบ</Button>
        </Row>
        <Row label="Interactive" hint="hover / focus me">
          <Button variant="primary">Hover me</Button>
          <Button variant="outline">Tab to focus</Button>
          <Button variant="ghost">Click &amp; hold</Button>
        </Row>
        <Row label="Disabled">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="danger" disabled>Danger</Button>
        </Row>
      </Section>

      {/* Modifiers */}
      <Section title="Modifiers — ตัวปรับแต่ง" code="pill · block">
        <Row label="Pill" hint="pill">
          <Button variant="primary" pill>เริ่มต้นใช้งาน</Button>
          <Button variant="outline" pill>เรียนรู้เพิ่มเติม</Button>
          <Button variant="ghost" pill>ติดต่อทีม</Button>
        </Row>
        <Row label="Full width" hint="block">
          <div className="w-full max-w-[420px]">
            <Button variant="primary" size="large" block>เข้าสู่ระบบ / Sign in</Button>
          </div>
        </Row>
      </Section>

      {/* On dark surface */}
      <Section title="On dark surface — บนพื้นเข้ม" code="brand panels / hero overlays">
        <Row label="Brand">
          <div className="flex flex-wrap items-center gap-[12px] rounded-xl bg-green-900 px-[24px] py-[20px]">
            <Button variant="primary">เข้าสู่ระบบ</Button>
            <Button variant="ghost">สมัครสมาชิก</Button>
            <Button variant="ghost" className="border-white/30 bg-white/10 text-white not-disabled:hover:bg-white/20">
              ติดต่อทีม
            </Button>
          </div>
        </Row>
      </Section>
    </main>
  )
}
