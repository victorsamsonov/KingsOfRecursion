from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
import os
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
# import tiktoken
# from langchain.embeddings.openai import OpenAIEmbeddings

class Chatbot():
    def create_database_from_docs_folder(self):
        os.environ["OPENAI_API_KEY"] = "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"

        #Load all the .txt files from docs directory
        loader = DirectoryLoader('./docs/',glob = "**/*.txt")
        documents = loader.load()
        print('NUMBER OF DOCUMENTS LOADED: ', len(documents))

        #Split text into tokens
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        chunks = text_splitter.split_documents(documents)
        print('NUMBER OF CHUNKS: ', len(chunks))

        print('Creating the embeddings...')
        # embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        print('Creating the vector database...')
        # db = Chroma.from_documents(chunks, embeddings, persist_directory="db")
        db = Chroma.from_documents(chunks, OpenAIEmbeddings())
        print('Vector database created')
        
        return db

    def __init__(self):
        self.db = self.create_database_from_docs_folder()
    
    
    def predict(self, user_query, user_style):
        k = 3
        docs_retrieved = self.db.max_marginal_relevance_search(user_query, k=k)

        context = ''
        
        for i, doc_retrieved in enumerate(docs_retrieved):
            context += '\n'
            context += f'\n{i+1}. Most relevant document: '
            context += '\nPAGE CONTENT: ' + doc_retrieved.page_content
            context += '\nREFERENCE: ' + doc_retrieved.metadata['source']
                    
        # context = docs_retrieved[0].page_content

        template = """You are gonna receive a <USER_QUERY>, and you should respond

        based on the <RETRIEVED_DOCUMENTS>. Your name is EffiSTEM, you are a chatbot which specializes in STEM while leveraging youtube playlists and uploaded notes by the user to generate answers. You also adapt to the learning style of the user, you will explain concepts in a way that the user likes.

        This is the user learning style, if the user has a hobbie, change your language and explain the concept in a language related to the user preferance, <USER_STYLE>: {user_style}.



        This is the <USER_QUERY>: {user_query}

        These are the <RETRIEVED_DOCUMENTS>: {context} 
        
        When you build your response, at the bottom of it, you should add the references 
        of the retrieved documents that you used. For instance, you should add all the
        filenames of the REFERENCE values that you receive in <RETRIEVED_DOCUMENTS>. Use <USER_STYLE> in order to explain concept, if the user likes basketball relate concepts to basketball only if it is a very technical question.
        
        Example questions: What is the name of the professor?
        
        Response: 
        
        The name of the professor is Andrew Ng.
        
        This information was found in the next references: 
        
        filename_1.txt
        filename_2.txt

        """

        prompt = PromptTemplate(template=template, input_variables=["user_style", "user_query", "context"])

        llm = OpenAI()

        llm_chain = LLMChain(prompt=prompt, llm=llm)

        print('CONTEXT: ', context)
        print('LEN CONTEXT: ', len(context))
        print('METADATA: ', docs_retrieved[0].metadata)
        
        response = llm_chain.run({
            'user_style': user_style,
            'user_query': user_query,
            'context': context
        })
        

        print('RESPONSE: ', response)
        return response


        
 