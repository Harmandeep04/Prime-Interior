import React from 'react';
import './css/OurProcess.css';
import { MessageCircle, PenTool, Palette, Hammer, BadgeCheck, Home } from 'lucide-react';

const OurProcess = () => {
    const steps = [
        { num: "01", title: "Initial Consultation", desc: "We start with a free consultation to understand your vision, needs, budget, and timeline.", icon: <MessageCircle size={40} strokeWidth={1.2} /> },
        { num: "02", title: "Concept & Design",     desc: "Our designers create mood boards, 3D renders, and detailed design concepts for your approval.", icon: <PenTool size={40} strokeWidth={1.2} /> },
        { num: "03", title: "Material Selection",   desc: "We guide you through selecting the finest materials, furniture, and finishes.", icon: <Palette size={40} strokeWidth={1.2} /> },
        { num: "04", title: "Execution",             desc: "Our skilled team executes the design with precision, keeping you updated throughout.", icon: <Hammer size={40} strokeWidth={1.2} /> },
        { num: "05", title: "Quality Check",         desc: "We do thorough quality checks to ensure everything meets our high standards.", icon: <BadgeCheck size={40} strokeWidth={1.2} /> },
        { num: "06", title: "Final Handover",        desc: "We do a final walkthrough with you and hand over your dream space.", icon: <Home size={40} strokeWidth={1.2} /> },
    ];

    return (
        <div className="process-page">

            {/* ── Hero Banner ── */}
            <section className="process-hero-banner">
                <img src="/images/background_2.jpg" alt="Our Process" />
                <div className="process-hero-overlay">
                    <p className="page-tag">HOW WE WORK</p>
                    <h1>Our Design <em>Process</em></h1>
                    <p>A seamless journey from concept to completion.</p>
                </div>
            </section>

            <section className="process-steps">
                {steps.map((step, i) => (
                    <div className="process-step" key={i}>
                        <div className="step-number">{step.num}</div>
                        <div className="step-content">
                            <div className="step-icon">{step.icon}</div>
                            <h2>{step.title}</h2>
                            <p>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="process-cta">
                <h2>Ready To Begin Your Journey?</h2>
                <p>Contact us today for a free consultation.</p>
                <button onClick={() => window.location.href = '/contact'}>Book Consultation ↗</button>
            </section>

        </div>
    );
};

export default OurProcess;