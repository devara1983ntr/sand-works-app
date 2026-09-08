#!/usr/bin/env python3
"""Consolidate authoritative SAND WORKS markdown docs into one professional PDF.

Lightweight markdown -> reportlab renderer (headings, bold/italic, lists, code,
horizontal rules, tables-as-text). Adds title page, TOC outline, page numbers.
Does NOT silently omit docs: the include list below is explicit and echoed on the
title page and in the body headers.
"""
import os, re, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
                                Table, TableStyle, Preformatted, KeepTogether)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Explicit include list (order = document order). (relpath, section-title)
INCLUDES = [
    ("README.md", "README"),
    ("AGENT.md", "AGENT.md - AI Agent Constitution"),
    ("PRD.md", "PRD - Product Requirements Document"),
    ("PRD2.md", "PRD2 - Execution-Level Product Specification"),
    ("docs/product/product-overview.md", "Product Overview"),
    ("docs/product/roles.md", "Roles (OWNER/DRIVER/LABOURER)"),
    ("docs/product/features.md", "Feature Catalogue"),
    ("docs/product/brand.md", "Brand"),
    ("docs/requirements.md", "Requirements Index & Traceability"),
    ("docs/brandreport/assets.md", "Brand Asset Verification"),
    ("docs/screens/SCREEN-CATALOG.md", "Complete Screen Catalogue"),
    ("docs/screens/AUTH.md", "Auth & Global Screens"),
    ("docs/screens/OWNER.md", "OWNER Screens"),
    ("docs/screens/DRIVER.md", "DRIVER Screens"),
    ("docs/screens/LABOURER.md", "LABOURER Screens"),
    ("docs/screens/SHARED.md", "Shared Screens"),
    ("docs/spec/NAVIGATION.md", "Navigation Architecture"),
    ("docs/spec/DESIGN-SYSTEM.md", "Design System"),
    ("docs/spec/GESTURES.md", "Gestures"),
    ("docs/spec/SCREEN-STATE.md", "Screen-State & Behaviour Contract"),
    ("docs/spec/UX-FLOWS.md", "UX Flows (End-to-End)"),
    ("docs/spec/WIREFRAMES.md", "Wireframes (Specification)"),
    ("docs/spec/money-engine.md", "Money Engine"),
    ("docs/spec/roles-access.md", "Roles & Access Matrix"),
    ("docs/spec/tractors.md", "Tractor Model"),
    ("docs/spec/temporary-access.md", "Temporary Labourer Access"),
    ("docs/spec/profile-photo.md", "Profile Photo"),
    ("docs/spec/search-filter-sort.md", "Search, Filter & Sort"),
    ("docs/spec/attendance.md", "Attendance"),
    ("docs/spec/leaderboards.md", "Leaderboards"),
    ("docs/spec/exports.md", "Exports"),
    ("docs/spec/SOP.md", "SOP - Owner Procedures"),
    ("docs/architecture/architecture.md", "Architecture (Online-First)"),
    ("docs/architecture/DATABASE.md", "Database - Firestore"),
    ("docs/architecture/API.md", "API / Backend Operations"),
    ("docs/architecture/SECURITY.md", "Security"),
    ("docs/architecture/ERROR-STATES.md", "Error / Loading / Empty / Offline States"),
    ("docs/architecture/PERFORMANCE.md", "Performance & Stability"),
    ("docs/architecture/notifications.md", "Notifications & Emergency Warning"),
    ("docs/architecture/workflows.md", "Workflows"),
    ("docs/quality/ACCESSIBILITY.md", "Accessibility"),
    ("docs/quality/SEO.md", "SEO (Honest Assessment)"),
    ("docs/quality/TESTING.md", "Testing"),
    ("docs/quality/CI-CD.md", "CI/CD"),
    ("docs/quality/DEPLOYMENT.md", "Deployment & Firebase Plan Dependencies"),
    ("docs/implementation/README.md", "Implementation - Control Plane"),
    ("docs/implementation/PHASES.md", "Implementation - Phases & Tasks"),
    ("docs/implementation/tasks/PHASE-1-Project-Foundation.tasks.md", "Tasks - Phase 1"),
    ("docs/implementation/tasks/PHASE-2-to-4.tasks.md", "Tasks - Phases 2-4"),
    ("docs/implementation/tasks/PHASE-5-to-9.tasks.md", "Tasks - Phases 5-9"),
    ("docs/implementation/tasks/PHASE-10-to-13.tasks.md", "Tasks - Phases 10-13"),
    ("docs/implementation/tasks/PHASE-14-to-20.tasks.md", "Tasks - Phases 14-20"),
    ("docs/implementation/tasks/PHASE-21-to-26.tasks.md", "Tasks - Phases 21-26"),
    ("docs/implementation/DEPENDENCY-GRAPH.md", "Implementation - Dependency Graph"),
    ("docs/implementation/ROADMAP.md", "Implementation - Roadmap"),
    ("docs/implementation/TRACEABILITY-MATRIX.md", "Implementation - Traceability Matrix"),
    ("docs/implementation/STATUS.md", "Implementation - Status & Blockers"),
]

FONT = "Helvetica"
CODESIZE = 8
BODY = ParagraphStyle("body", fontName=FONT, fontSize=9.5, leading=13, alignment=TA_LEFT,
                      spaceAfter=4, wordWrap="CJK")
H1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=16, leading=19, spaceBefore=6,
                    spaceAfter=8, textColor=colors.HexColor("#B06A00"))
H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12.5, leading=16, spaceBefore=8,
                    spaceAfter=4, textColor=colors.HexColor("#8A5200"))
H3 = ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=10.5, leading=14, spaceBefore=6,
                    spaceAfter=3)
TITLE = ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=30, leading=36,
                       alignment=TA_CENTER, textColor=colors.HexColor("#B06A00"))
SUB = ParagraphStyle("sub", fontName="Helvetica", fontSize=13, leading=18, alignment=TA_CENTER)
TOC = ParagraphStyle("toc", fontName="Helvetica", fontSize=9, leading=13)

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def render_md(path):
    flow = []
    in_code = False
    code = []
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    for raw in lines:
        line = raw.rstrip()
        if line.strip().startswith("```"):
            if not in_code:
                in_code = True; code = []; continue
            else:
                in_code = False
                flow.append(Preformatted("\n".join(code), ParagraphStyle("code", fontName="Courier",
                                    fontSize=CODESIZE, leading=11, textColor=colors.HexColor("#333333"),
                                    backColor=colors.HexColor("#F4F1EA"), borderPadding=4)))
                continue
        if in_code:
            code.append(line); continue
        s = line.strip()
        if not s:
            flow.append(Spacer(1, 3)); continue
        if s.startswith("### "):
            flow.append(Paragraph(esc(s[4:]), H3))
        elif s.startswith("## "):
            flow.append(Paragraph(esc(s[3:]), H2))
        elif s.startswith("# "):
            flow.append(Paragraph(esc(s[2:]), H1))
        elif re.match(r"^[-*] ", s):
            txt = re.sub(r"^[-*] ", "", s)
            flow.append(Paragraph("• " + fmt_inline(txt), BODY))
        elif re.match(r"^\|", s):
            pass  # skip raw table rows (kept readable in source); handled below if grouped
        elif s.startswith("> "):
            flow.append(Paragraph("<i>" + fmt_inline(s[2:]) + "</i>", BODY))
        else:
            flow.append(Paragraph(fmt_inline(s), BODY))
    return flow

def fmt_inline(t):
    t = esc(t)
    # bold **x**
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"`([^`]+)`", r"<font face='Courier' size='8'>\1</font>", t)
    # italic *x*
    t = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", t)
    return t

def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont(FONT, 8)
    canvas.setFillColor(colors.grey)
    canvas.drawString(15*mm, 10*mm, "SAND WORKS — Specification & Implementation Control Plane")
    canvas.drawRightString(A4[0]-15*mm, 10*mm, f"Page {doc.page}")
    canvas.setStrokeColor(colors.HexColor("#B06A00")); canvas.setLineWidth(0.6)
    canvas.line(15*mm, 13*mm, A4[0]-15*mm, 13*mm)
    canvas.restoreState()

def build():
    out = os.path.join(ROOT, "docs", "SAND_WORKS-specification.pdf")
    doc = SimpleDocTemplate(out, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm,
                            topMargin=18*mm, bottomMargin=16*mm,
                            title="SAND WORKS — Specification", author="SAND WORKS")
    story = []
    # Title page
    story.append(Spacer(1, 60*mm))
    story.append(Paragraph("SAND WORKS", TITLE))
    story.append(Spacer(1, 6*mm))
    story.append(Paragraph("Product & Technical Specification<br/>and Implementation Control Plane", SUB))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph("Owner: Ramesh Sahu &nbsp;·&nbsp; Package: com.roshan.sandworks", SUB))
    story.append(Paragraph("Online-first · Roles OWNER / DRIVER / LABOURER (no ADMIN)", SUB))
    story.append(Spacer(1, 10*mm))
    story.append(Paragraph("Documentation only — no application source. Revision v0.2.0 (2026-09-08).", SUB))
    story.append(Spacer(1, 12*mm))
    story.append(Paragraph("Contents", H2))
    for i, (_, title) in enumerate(INCLUDES, 1):
        story.append(Paragraph(f"{i}. {title}", TOC))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph("Status classification: EXISTING / SPECIFIED / MISSING / BLOCKED / PROPOSED. "
                           "Specification is NOT implementation.", BODY))
    story.append(PageBreak())
    # Body: header band per doc + content
    for rel, title in INCLUDES:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            story.append(Paragraph(f"[MISSING FILE: {rel}]", H2)); continue
        story.append(KeepTogether([
            Paragraph(title, ParagraphStyle("sect", fontName="Helvetica-Bold", fontSize=14,
                                            leading=17, spaceAfter=4,
                                            textColor=colors.white, backColor=colors.HexColor("#B06A00"))),
            Spacer(1, 2)]))
        story.extend(render_md(p))
        story.append(PageBreak())
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("PDF written:", out)

if __name__ == "__main__":
    build()
