package com.joyshot.app.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author avery
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo("Spring Boot using Swagger2 to build APIs", "1.0"))
                .enable(true)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.lhdecor.crm.controller"))
                .build();
    }

//    @Bean
//    public Docket restApi() {
//        return new Docket(DocumentationType.SWAGGER_2)
//                .groupName("API")
//                .apiInfo(apiInfo("Spring Boot using Swagger2 to build APIs", "1.0"))
//                .useDefaultResponseMessages(true)
//                .forCodeGeneration(false)
//                .select()
//                .apis(RequestHandlerSelectors.basePackage("com.lhdecor.crm.controller"))
//                .paths(PathSelectors.any())
//                .build();
//    }
//
    private ApiInfo apiInfo(String title, String version) {
        Contact contact = new Contact("雲騰資訊有限公司", "https://helpyousmartgrow.com", "service@helpyousmartgrow.com");
        return new ApiInfoBuilder()
                .title(title)
                .description("For LH Project")
                .termsOfServiceUrl("https://lh-decor.com")
                .contact(contact)
                .version(version)
                .build();
    }
}
