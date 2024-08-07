import { TextInput, Textarea, NumberInput } from '@/components/inputs'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Stack,
  Text,
} from '@chakra-ui/react'
import { isEmpty } from '@typebot.io/lib'
import { ZemanticAiBlock } from '@typebot.io/schemas'
import { ProjectsDropdown } from './ProjectsDropdown'
import { SearchResponseItem } from './SearchResponseItem'
import { TableList } from '@/components/TableList'

type Props = {
  block: ZemanticAiBlock
  onOptionsChange: (options: ZemanticAiBlock['options']) => void
}

export const ZemanticAiSettings = ({
  block: { id: blockId, options },
  onOptionsChange,
}: Props) => {
  const updateProjectId = (projectId: string | undefined) => {
    onOptionsChange({
      ...options,
      projectId: isEmpty(projectId) ? undefined : projectId,
    })
  }

  const updateQuery = (query: string) => {
    onOptionsChange({
      ...options,
      query: isEmpty(query) ? undefined : query,
    })
  }

  const updateMaxResults = (
    maxResults: number | `{{${string}}}` | undefined
  ) => {
    onOptionsChange({
      ...options,
      maxResults: maxResults as number,
    })
  }

  const updateSystemPrompt = (systemPrompt: string) => {
    onOptionsChange({
      ...options,
      systemPrompt: isEmpty(systemPrompt) ? undefined : systemPrompt,
    })
  }

  const updatePrompt = (prompt: string) => {
    onOptionsChange({
      ...options,
      prompt: isEmpty(prompt) ? undefined : prompt,
    })
  }

  const updateResponseMapping = (
    responseMapping: NonNullable<ZemanticAiBlock['options']>['responseMapping']
  ) => {
    onOptionsChange({
      ...options,
      responseMapping,
    })
  }

  return (
    <Stack spacing={4}>
      {options?.credentialsId && (
        <>
          <ProjectsDropdown
            credentialsId={options?.credentialsId as string}
            defaultValue={(options?.projectId as string) ?? ''}
            onChange={updateProjectId}
            blockId={blockId as string}
          />
          <TextInput
            label="Query:"
            moreInfoTooltip="The question you want to ask or search against the documents in the project."
            defaultValue={options?.query ?? ''}
            onChange={updateQuery}
            withVariableButton={true}
            placeholder="Content"
          />
          <NumberInput
            label="Max Results:"
            moreInfoTooltip="The maximum number of document chunk results to return from your search."
            direction="column"
            defaultValue={options?.maxResults}
            onValueChange={updateMaxResults}
            placeholder="i.e. 3"
            w="full"
          />
          <Accordion allowMultiple={true}>
            <AccordionItem>
              <AccordionButton>
                <Text w="full" textAlign="left">
                  Advanced settings
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} as={Stack} spacing={6}>
                <Textarea
                  label="System Prompt:"
                  moreInfoTooltip="System prompt to send to the summarization LLM. This is prepended to the prompt and helps guide system behavior."
                  defaultValue={options?.systemPrompt ?? ''}
                  onChange={updateSystemPrompt}
                  placeholder="System Prompt"
                  withVariableButton={true}
                />
                <Textarea
                  label="Prompt:"
                  moreInfoTooltip="Prompt to send to the summarization LLM."
                  defaultValue={options?.prompt ?? ''}
                  onChange={updatePrompt}
                  placeholder="Prompt"
                  withVariableButton={true}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Text w="full" textAlign="left">
                  Save answer
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <TableList
                  initialItems={options.responseMapping ?? []}
                  onItemsChange={updateResponseMapping}
                  newItemDefaultProps={{ valueToExtract: 'Summary' }}
                >
                  {(props) => <SearchResponseItem {...props} />}
                </TableList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      )}
    </Stack>
  )
}
