import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
	AlertTriangle,
	ArrowRight,
	Check,
	LoaderCircle,
	LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	type ReportInput,
	reportCategories,
	reportInputSchema,
} from "./schema";
import { type CreateReportResult, createReport } from "./server";

const areas = [
	"Al Haram area",
	"Central Madinah",
	"Quba",
	"Uhud",
	"Qiblatain",
	"Al-Aqiq",
	"Train station",
	"Other area",
];

export function ReportForm({ type }: { type: "lost" | "found" }) {
	const createReportFn = useServerFn(createReport);
	const [result, setResult] = useState<CreateReportResult | null>(null);
	const [submitError, setSubmitError] = useState("");
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ReportInput>({
		resolver: zodResolver(reportInputSchema),
		defaultValues: { type, occurredAt: new Date().toISOString().slice(0, 10) },
	});

	const onSubmit = handleSubmit(async (values) => {
		setSubmitError("");
		try {
			setResult(await createReportFn({ data: { ...values, type } }));
		} catch {
			setSubmitError(
				"We could not submit your report. Please try again in a moment.",
			);
		}
	});

	if (result) {
		return (
			<section className="submission-success" aria-live="polite">
				<span className="success-icon">
					<Check size={27} />
				</span>
				<p className="eyebrow">Report received</p>
				<h2>Thank you for helping.</h2>
				<p>
					Your reference is <strong>{result.referenceCode}</strong>. Keep this
					private link to update or close your report.
				</p>
				<Link
					to="/manage/$token"
					params={{ token: result.managementUrl.split("/").pop() ?? "" }}
					className="button button-primary"
				>
					Manage this report <ArrowRight size={17} />
				</Link>
				{result.matches.length > 0 && (
					<div className="instant-matches">
						<h3>Possible matches</h3>
						<p>
							These reports share some details. Please verify directly; a match
							is only a suggestion.
						</p>
						{result.matches.slice(0, 3).map((match) => (
							<div className="instant-match" key={match.id}>
								<span className={`type-pill ${match.type}`}>{match.type}</span>
								<span>
									<strong>{match.title}</strong>
									<small>
										{match.locationName} · {match.score}% similarity
									</small>
								</span>
							</div>
						))}
					</div>
				)}
			</section>
		);
	}

	return (
		<form className="report-form" onSubmit={onSubmit} noValidate>
			<div className="form-grid">
				<label className="field">
					<span>
						What is the item? <b>*</b>
					</span>
					<input
						{...register("title")}
						placeholder="e.g. Small black backpack"
						autoComplete="off"
					/>
					{errors.title && (
						<small className="field-error">{errors.title.message}</small>
					)}
				</label>
				<label className="field">
					<span>
						Category <b>*</b>
					</span>
					<select {...register("category")} defaultValue="">
						<option value="" disabled>
							Select a category
						</option>
						{reportCategories.map((category) => (
							<option key={category}>{category}</option>
						))}
					</select>
					{errors.category && (
						<small className="field-error">{errors.category.message}</small>
					)}
				</label>
				<label className="field field-wide">
					<span>
						Description <b>*</b>
					</span>
					<textarea
						{...register("description")}
						rows={4}
						placeholder="Share helpful details, but keep one or two distinctive details private so ownership can be verified."
					/>
					{errors.description && (
						<small className="field-error">{errors.description.message}</small>
					)}
				</label>
				<label className="field">
					<span>Color</span>
					<input {...register("color")} placeholder="e.g. Navy blue" />
				</label>
				<label className="field">
					<span>Brand or maker</span>
					<input {...register("brand")} placeholder="If known" />
				</label>
				{type === "lost" && (
					<label className="field field-wide">
						<span>Distinctive details</span>
						<input
							{...register("characteristics")}
							placeholder="A detail that can help identify it"
						/>
					</label>
				)}
				<label className="field">
					<span>
						{type === "lost" ? "Last known area" : "Area where you found it"}{" "}
						<b>*</b>
					</span>
					<select {...register("locationName")} defaultValue="">
						<option value="" disabled>
							Select an area
						</option>
						{areas.map((area) => (
							<option key={area}>{area}</option>
						))}
					</select>
					{errors.locationName && (
						<small className="field-error">{errors.locationName.message}</small>
					)}
				</label>
				<label className="field">
					<span>
						{type === "lost" ? "Date last seen" : "Date found"} <b>*</b>
					</span>
					<input
						type="date"
						max={new Date().toISOString().slice(0, 10)}
						{...register("occurredAt")}
					/>
					{errors.occurredAt && (
						<small className="field-error">{errors.occurredAt.message}</small>
					)}
				</label>
			</div>

			<div className="privacy-note">
				{type === "found" ? (
					<AlertTriangle size={18} />
				) : (
					<LockKeyhole size={18} />
				)}
				<p>
					{type === "found"
						? "Please do not share names, document numbers, card details, or unlock codes. For passports, bank cards, phones, and official documents, use an authorized lost-property channel where applicable."
						: "Keep sensitive identifying details private. Never include passport or card numbers, unlock codes, or full identity-document details."}
				</p>
			</div>

			<div className="form-divider">
				<span>Private contact — never shown publicly</span>
			</div>
			<div className="form-grid">
				<label className="field">
					<span>Email address</span>
					<input
						type="email"
						autoComplete="email"
						{...register("email")}
						placeholder="you@example.com"
					/>
					{errors.email && (
						<small className="field-error">{errors.email.message}</small>
					)}
				</label>
				<label className="field">
					<span>Phone number</span>
					<input
						type="tel"
						autoComplete="tel"
						{...register("phone")}
						placeholder="+966 ..."
					/>
				</label>
			</div>
			<p className="form-help">
				Provide at least one way for someone to reach you. Your details stay
				private.
			</p>
			{submitError && (
				<p className="submit-error" role="alert">
					{submitError}
				</p>
			)}
			<button
				type="submit"
				className="button button-primary submit-button"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<LoaderCircle size={17} className="spin" /> Sending report…
					</>
				) : (
					<>
						Submit report <ArrowRight size={17} />
					</>
				)}
			</button>
			<p className="terms-note">
				By submitting, you confirm this is accurate and agree to keep
				communication respectful.
			</p>
		</form>
	);
}
