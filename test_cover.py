from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            # Do NOT draw full rect on canvas pass to avoid covering flowable text!
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1E40AF"))
        
        # Header
        self.drawString(20 * mm, 282 * mm, "CAREPLUS HOSPITAL MANAGEMENT SYSTEM (HMS)")
        self.drawRightString(190 * mm, 282 * mm, "FULL STACK PROJECT DOCUMENTATION | VESA PROGRAM")
        
        self.setStrokeColor(colors.HexColor("#2563EB"))
        self.setLineWidth(1)
        self.line(20 * mm, 279 * mm, 190 * mm, 279 * mm)

        # Footer
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(20 * mm, 12 * mm, "CarePlus Hospital Enterprise Systems")
        self.drawRightString(190 * mm, 12 * mm, f"Page {self._pageNumber} of {page_count}")
        
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(20 * mm, 17 * mm, 190 * mm, 17 * mm)
        self.restoreState()

doc = SimpleDocTemplate(
    "test_out.pdf",
    pagesize=A4,
    leftMargin=20 * mm,
    rightMargin=20 * mm,
    topMargin=20 * mm,
    bottomMargin=20 * mm
)

styles = getSampleStyleSheet()

p_head = ParagraphStyle('H', fontName='Helvetica-Bold', fontSize=18, textColor=colors.white)
p_sub = ParagraphStyle('S', fontName='Helvetica-Bold', fontSize=9, textColor=colors.HexColor("#93C5FD"))
p_title = ParagraphStyle('T', fontName='Helvetica-Bold', fontSize=26, leading=32, textColor=colors.white)
p_subt = ParagraphStyle('ST', fontName='Helvetica', fontSize=13, leading=17, textColor=colors.HexColor("#93C5FD"))

# Cover Page Hero Banner Table
hero_content = [
    [Paragraph("🏥 CAREPLUS HOSPITAL", p_head)],
    [Paragraph("ENTERPRISE HEALTHCARE SYSTEMS", p_sub)],
    [Spacer(1, 15 * mm)],
    [Paragraph("✦ OFFICIAL TECHNICAL SPECIFICATION & SYSTEM ARCHITECTURE ✦", p_sub)],
    [Spacer(1, 3 * mm)],
    [Paragraph("CarePlus Hospital Management System", p_title)],
    [Spacer(1, 3 * mm)],
    [Paragraph("Full Stack Enterprise Project Documentation & Implementation Report", p_subt)],
    [Spacer(1, 10 * mm)]
]

hero_table = Table(hero_content, colWidths=[170 * mm])
hero_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#09152E")),
    ('PADDING', (0,0), (-1,-1), 16),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#1D4ED8")),
]))

meta_data = [
    [Paragraph("PROJECT TITLE", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8"))),
     Paragraph("CLIENT / ORGANIZATION", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8")))],
    [Paragraph("Hospital Management System (CarePlus HMS)", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white)),
     Paragraph("CarePlus Hospital", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white))],
    [Paragraph("PREPARED BY", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8"))),
     Paragraph("PROGRAM SUBMISSION", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8")))],
    [Paragraph("Vedant", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white)),
     Paragraph("VESA Skill Development Program", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white))],
    [Paragraph("DOCUMENT VERSION", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8"))),
     Paragraph("DATE OF SUBMISSION", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8")))],
    [Paragraph("v1.0.0 (Enterprise Release)", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white)),
     Paragraph("August 5, 2026", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white))],
    [Paragraph("REPOSITORY NAME", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8"))),
     Paragraph("STAGING & REST BASE URL", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#94A3B8")))],
    [Paragraph("VedantD10/careplus-hospital-system", ParagraphStyle('M2', fontName='Courier-Bold', fontSize=9, textColor=colors.HexColor("#60A5FA"))),
     Paragraph("http://localhost:3000 / /api", ParagraphStyle('M2', fontName='Courier-Bold', fontSize=9, textColor=colors.HexColor("#60A5FA")))]
]

meta_table = Table(meta_data, colWidths=[85 * mm, 85 * mm])
meta_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0F172A")),
    ('PADDING', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#1E3A8A")),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#1E293B")),
]))

footer_p1 = Paragraph("CONFIDENTIAL  •  PREPARED FOR VESA SKILL DEVELOPMENT PROGRAM", ParagraphStyle('F1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#1E40AF")))
footer_p2 = Paragraph("CAREPLUS HOSPITAL ENTERPRISE SYSTEMS © 2026", ParagraphStyle('F2', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#64748B"), alignment=2))

ft_table = Table([[footer_p1, footer_p2]], colWidths=[100 * mm, 70 * mm])
ft_table.setStyle(TableStyle([
    ('LINEABOVE', (0,0), (-1,-1), 1, colors.HexColor("#2563EB")),
    ('PADDING', (0,0), (-1,-1), 6),
]))

story = [
    Spacer(1, 5 * mm),
    hero_table,
    Spacer(1, 8 * mm),
    meta_table,
    Spacer(1, 15 * mm),
    ft_table,
    PageBreak(),
    Paragraph("Page 2 - Table of Contents", styles['Heading1'])
]

doc.build(story, canvasmaker=NumberedCanvas)
print("Built test_out.pdf successfully!")
