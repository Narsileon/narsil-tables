import { format } from "date-fns";
import { GlobalProps } from "@narsil-ui/Types";
import { useDatetimeLocale } from "@narsil-ui/Components/Input/Datetime/datetimeUtils";
import { useFormContext } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import { useTranslationsStore } from "@narsil-localization/Stores/translationStore";
import Card from "@narsil-ui/Components/Card/Card";
import FormControl from "@narsil-forms/Components/Form/FormControl";
import FormField from "@narsil-forms/Components/Form/FormField";
import FormItem from "@narsil-forms/Components/Form/FormItem";
import FormLabel from "@narsil-forms/Components/Form/FormLabel";
import Separator from "@narsil-ui/Components/Separator/Separator";
import Switch from "@narsil-ui/Components/Switch/Switch";
import CardContent from "@narsil-ui/Components/Card/CardContent";

const ResourceFormSidebar = ({ data }) => {
	const { trans } = useTranslationsStore();

	const { locale } = usePage<GlobalProps>().props.shared.localization;

	const { control } = useFormContext();

	const datetimeLocale = useDatetimeLocale(locale);

	return (
		<Card className='h-fit'>
			<CardContent className='w-full lg:w-48'>
				<FormField
					control={control}
					name={"active"}
					render={({ field }) => (
						<FormItem orientation='horizontal'>
							<FormLabel htmlFor={"active"}>{trans("Active") + trans(":")}</FormLabel>
							<FormControl>
								<Switch
									{...field}
									id={"active"}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Separator />
				{data.created_at ? (
					<div className='flex gap-x-1 text-sm lg:flex-col'>
						<span className='whitespace-nowrap'>
							{trans("validation.attributes.created_at") + trans(":")}
						</span>
						<span>{format(data.created_at, "PPPpp", { locale: datetimeLocale })}</span>
					</div>
				) : null}
				{data.updated_at ? (
					<div className='flex gap-x-1 text-sm lg:flex-col'>
						<span className='whitespace-nowrap'>
							{trans("validation.attributes.updated_at") + trans(":")}
						</span>
						<span>{format(data.updated_at, "PPPpp", { locale: datetimeLocale })}</span>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
};

export default ResourceFormSidebar;
